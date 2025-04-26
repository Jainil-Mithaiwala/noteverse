class Config {
  constructor() {
    this.backendurl = "https://noteverse-api.onrender.com/";
    //     this.backendurl = "http://localhost:5000/";
  }

  getHeaders(token) {
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  }
}

export default new Config();
