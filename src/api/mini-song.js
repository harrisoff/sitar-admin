import { databaseAdd, databaseAggregate } from "./mini-base";
import { databaseUpdate } from "./mini-extend";
import { fileUploadIfNone, fileUploadForce } from "./mini-file";
import { parseArray, genFileURL } from "../utils/wx";

import { COLLECTIONS, STORAGE } from "../../config";

// 上传/编辑专辑
export function uploadAlbumCover(file, filename) {
  return fileUploadIfNone(file, STORAGE.ALBUM_COVER, filename);
}
export function addAlbum(albumInfo) {
  const query = `
  db.collection('${COLLECTIONS.ALBUM}')
  .add({
    data: ${JSON.stringify(albumInfo)}
  })
  `;
  return new Promise((resolve, reject) => {
    return databaseAdd(query)
      .then(({ id_list }) => {
        resolve(id_list[0]);
      })
      .catch(reject);
  });
}
export function setAlbumSongs(albumId, songIds) {
  const query = `
  db.collection('${COLLECTIONS.ALBUM}')
  .where({
    _id: '${albumId}',
  })
  .update({
    data: {
      song_id: ${JSON.stringify(songIds)}
    }
  })
`;
  return databaseUpdate(query);
}
export function editAlbum(albumId, albumInfo) {
  const query = `
  db.collection('${COLLECTIONS.ALBUM}')
  .where({
    _id: '${albumId}',
  })
  .update({
    data: ${JSON.stringify(albumInfo)}
  })
`;
  return databaseUpdate(query);
}

// 上传歌曲
export function uploadSongFile(file, filename, onUploadPercent) {
  return fileUploadForce(file, STORAGE.SONG, filename, onUploadPercent);
}
export function addSongs(songInfos) {
  const query = `
  db.collection('${COLLECTIONS.SONG}')
  .add({
    data: ${JSON.stringify(songInfos)}
  })
  `;
  return new Promise((resolve, reject) => {
    return databaseAdd(query)
      .then(({ id_list }) => {
        resolve(id_list);
      })
      .catch(reject);
  });
}

//
export function getAlbums() {
  const query = `
  db.collection('${COLLECTIONS.ALBUM}').aggregate()
  .lookup({
    from: '${COLLECTIONS.SONG}',
    localField: 'song_id',
    foreignField: '_id',
    as: 'songs',
  })
  .end()
  `;

  return new Promise((resolve, reject) => {
    databaseAggregate(query)
      .then(({ data }) => {
        const jsonData = parseArray(data);
        const result = jsonData.map(item => {
          const { _id, artist, title, release_time, songs, cover_id } = item;
          const songList = songs.map(song => {
            const { title, cloud_id, _id } = song;
            return { title, _id, url: genFileURL(cloud_id) };
          });
          return {
            _id,
            artist,
            title,
            release_time,
            songList,
            cover: genFileURL(cover_id)
          };
        });
        resolve(result);
      })
      .catch(reject);
  });
}
