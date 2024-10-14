import blogFileNames from '../data/blogFileNames.json';
import Blog from "../model/Blog.js";

class BlogLoader {

  static BLOG_FILE_PATH = '/blog/blogFileNames.json'; // 여기에 경로를 입력하세요

  static async loadBlogList() {
    return blogFileNames.map(blogFileName => this.extractFileInfo(blogFileName));
  }

  static extractFileInfo(filename) {
    let matches = this.parseFileName(filename);

    if (matches) {
      let date = this.formatDate(matches[1]);
      let title = matches[2];
      let category = matches[3];
      let tag = matches[4].split(" ");
      let thumbnail = matches[5];
      let fileType = matches[6];
      return new Blog(date, title, category, tag, thumbnail, fileType, fileType, fileType);
    }
    throw new Error("해당 파일이 존재하지 않습니다.");
  }

  static parseFileName(filename) {
    // [날짜, 제목, 카테고리, 태그, 썸네일]
    const regex = /^\[(\d{8})\]_\[(.*?)\]_\[(.*?)\]_\[(.*?)\]_\[(.*?)\].(md)$/;
    return filename.match(regex);
  }


  static formatDate(dateString) { // "YYYYMMDD" -> "YYYY/MM/DD"
    const year = dateString.substring(0, 4);
    const month = dateString.substring(4, 6);
    const day = dateString.substring(6, 8);

    return `${year}/${month}/${day}`;
  }

}

export default BlogLoader;