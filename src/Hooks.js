import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useCamera } from "@ionic/react-hooks/camera";
import { useFilesystem, base64FromPath } from "@ionic/react-hooks/filesystem";
import { isPlatform, useIonViewDidEnter } from "@ionic/react";
import {
  CameraResultType,
  CameraSource,
  CameraPhoto,
  Capacitor,
  FilesystemDirectory,
} from "@capacitor/core";

export const useScrollIonContentToBottom = ({ after_every_render }) => {
  const { ion_content_ref } = useSelector((state) => state.App);
  const scroll_to_bottom = async () => {
    if (ion_content_ref && ion_content_ref.current !== null) {
      const scroll_element = await ion_content_ref.current.getScrollElement();

      scroll_element.scrollTop = scroll_element.scrollHeight;
    }
  };

  useIonViewDidEnter(scroll_to_bottom);
  useEffect(() => {
    if (after_every_render === true) {
      scroll_to_bottom();
    }
  });
};

export const usePhotos = ({
  selector,
  update_handler,
  preserve_photo_data_on_unmount,
}) => {
  const { getPhoto } = useCamera();
  const { deleteFile, readFile, writeFile } = useFilesystem();

  const photos = useSelector(selector);

  const takePhoto = async () => {
    const cameraPhoto = await getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      quality: 100,
    });
    const fileName = new Date().getTime() + ".jpeg";
    const savedFileImage = await savePicture(cameraPhoto, fileName);
    const newPhotos = [savedFileImage, ...photos];

    update_handler(newPhotos);
  };

  const getPhotoFromFilesystem = async (base64Data, fileName) => {
    const savedFileImage = await savePhotoFromFilesystem(base64Data, fileName);
    const newPhotos = [savedFileImage, ...photos];

    update_handler(newPhotos);
  };

  const savePhotoFromFilesystem = async (base64Data, fileName) => {
    const savedFile = await writeFile({
      path: fileName,
      data: base64Data,
      directory: FilesystemDirectory.Data,
    });

    if (isPlatform("hybrid")) {
      // Display the new image by rewriting the 'file://' path to HTTP
      // Details: https://ionicframework.com/docs/building/webview#file-protocol
      return {
        filepath: savedFile.uri,
        webviewPath: Capacitor.convertFileSrc(savedFile.uri),
        base64: base64Data,
      };
    } else {
      // Use webPath to display the new image instead of base64 since it's
      // already loaded into memory
      return {
        filepath: fileName,
        webviewPath: Capacitor.convertFileSrc(savedFile.uri),
        base64: base64Data,
      };
    }
  };

  const savePicture = async (photo, fileName) => {
    let base64Data;
    // "hybrid" will detect Cordova or Capacitor;
    if (isPlatform("hybrid")) {
      const file = await readFile({
        path: photo.path,
      });
      base64Data = file.data;
    } else {
      base64Data = await base64FromPath(photo.webPath);
    }
    const savedFile = await writeFile({
      path: fileName,
      data: base64Data,
      directory: FilesystemDirectory.Data,
    });

    if (isPlatform("hybrid")) {
      // Display the new image by rewriting the 'file://' path to HTTP
      // Details: https://ionicframework.com/docs/building/webview#file-protocol
      return {
        filepath: savedFile.uri,
        webviewPath: Capacitor.convertFileSrc(savedFile.uri),
        base64: base64Data,
      };
    } else {
      // Use webPath to display the new image instead of base64 since it's
      // already loaded into memory
      return {
        filepath: fileName,
        webviewPath: photo.webPath,
        base64: base64Data,
      };
    }
  };

  const deletePhoto = async (photo) => {
    // Remove this photo from the Photos reference data array
    const newPhotos = photos.filter((p) => p.filepath !== photo.filepath);

    // delete photo file from filesystem
    const filename = photo.filepath.substr(photo.filepath.lastIndexOf("/") + 1);

    await deleteFile({
      path: filename,
      directory: FilesystemDirectory.Data,
    });

    update_handler(newPhotos);
  };

  useEffect(() => {
    if (!preserve_photo_data_on_unmount) {
      return photos.forEach(deletePhoto);
    }
  }, []);

  return {
    takePhoto,
    getPhotoFromFilesystem,
    deletePhoto,
    photos,
  };
};
