class BlogLoader {

  static BLOG_FILE_PATH = '/blog'; // 여기에 경로를 입력하세요

  static async loadBlogList() {

    let fileNames = this.getFileNamesIn()
    console.log(fileNames);

    let fileInfo = this.extractFileInfo("[20240528]_[[백준] 17299(Glod3) - 오등큰수]_[다이아챌린지]_[kotlin python]_[boj.png].md");
    console.log(fileInfo);

    return [
      { id: 1, title: "첫 번째 블로그" },
      { id: 2, title: "두 번째 블로그" },
      { id: 3, title: "세 번째 블로그" },
    ];
  }

  static async getFileNamesIn() {
    // TODO : 파일 제목 가져오기
    // const response = await fetch(this.BLOG_FILE_PATH);
    return null
  };

  static extractFileInfo(filename) {
    let matches = this.parseFileName(filename);

    if (matches) {
      return {
        date: this.formatDate(matches[1]),
        title: matches[2],
        category: matches[3],
        tag: matches[4].split(" "),
        thumbnail: matches[5],
        fileType: matches[6],
      };
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