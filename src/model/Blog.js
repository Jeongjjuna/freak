class Blog {
  constructor(date, title, category, tags, thumbnail, fileType) {
    this.date = date // "YYYY-MM-DD"
    this.title = title;
    this.category = category;
    this.tags = tags;
    this.thumbnail = thumbnail;
    this.fileType = fileType;
  }

  getFileName() {
    const formattedDate = this.date.replace(/-/g, ''); // 하이픈 제거
    return `[${formattedDate}]_[${this.title}]_[${this.category}]_[${this.tags.join(' ')}]_[${this.thumbnail}]`;
  }
}

export default Blog;