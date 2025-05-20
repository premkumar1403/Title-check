const mongoose = require("mongoose");

const fileschema = new mongoose.Schema({
  Title: { type: String },
  Author_Mail: { type: String },
  Conference: {
    Conference_Name: { type: String },
    Decision_With_Commends: { type: String },
  },
});
const file = mongoose.model("Excel", fileschema);

const fileModel = {
  checkTitleExist: async (payload) => {
    console.log(payload);

    const { Title, Author_Mail, Conference_Name, Decision_With_Commends } =
      payload;
    const exist = await file.findOne({ Title });
    if (exist) {
      return exist;
    } else {
      return await file.insertMany({
        Title: Title,
        Author_Mail: Author_Mail,
        Conference: {
          Conference_Name: Conference_Name,
          Decision_With_Commends: Decision_With_Commends,
        },
      });
    }
  },

  createField: async (payload) => {
    await fileModel.checkTitleExist(payload);
  },

  getFiles: async (payload) => {
    const { Title } = payload;
    try {
      const response = await file.findOne({ Title: Title });
      return response;
    } catch (error) {
      return new Error("error validating title");
    }
  },

  updateField: () => {},
};

module.exports = fileModel;
