const mongoose = require("mongoose");

const fileschema = new mongoose.Schema({
  Title: { type: String },
  Author_Mail: [{ Author_Mail: { type: String } }],
  Conference: [
    {
      Conference_Name: { type: String },
      Decision_With_Commends: { type: String },
    },
  ],
});

const file = mongoose.model("Excel", fileschema);

const fileModel = {
  // Handles a single entry insert/update
  checkTitleExist: async (payload) => {
    const { Title, Author_Mail, Conference_Name, Decision_With_Commends } =
      payload;

    const normalizedTitle = Title;
    const normalizedEmail = Author_Mail;

    const existingFile = await file.findOne({ Title: normalizedTitle });

    if (existingFile) {
      const authorExists = existingFile.Author_Mail.some(
        (author) => author.Author_Mail === normalizedEmail
      );

      if (!authorExists) {
        existingFile.Author_Mail.push({ Author_Mail: normalizedEmail });
      }

      const confIndex = existingFile.Conference.findIndex(
        (conf) => conf.Conference_Name === Conference_Name
      );

      if (confIndex !== -1) {
        if (Decision_With_Commends) {
          existingFile.Conference[confIndex].Decision_With_Commends =
            Decision_With_Commends;
        }
      } else {
        existingFile.Conference.push({
          Conference_Name,
          Decision_With_Commends,
        });
      }

      const saved = await existingFile.save();
      return { updated: true, data: saved };
    } else {
      const newEntry = await file.create({
        Title: normalizedTitle,
        Author_Mail: [{ Author_Mail: normalizedEmail }],
        Conference: [{ Conference_Name, Decision_With_Commends }],
      });
      return { updated: false, data: newEntry };
    }
  },

  // Bulk handler for a sheet
  processConferenceSheet: async (rows) => {
    const matched = [];
    const newEntries = [];

    for (const row of rows) {
      if (!row.Title || !row.Author_Mail || !row.Conference_Name) continue;

      const result = await fileModel.checkTitleExist({
        Title: row.Title,
        Author_Mail: row.Author_Mail,
        Conference_Name: row.Conference_Name,
        Decision_With_Commends: row.Decision_With_Commends || "",
      });

      if (result.updated) {
        matched.push(result.data);
      } else {
        newEntries.push(result.data);
      }
    }

    return { matched, newEntries };
  },

  createField: async (payload) => {
    const result = await fileModel.checkTitleExist(payload);
    const isNew = !result.updated;
    return { wasNew: isNew, data: result.data };
  },

  getFile: async () => {
    return await file.find();
  },

  searchTitle: async (Title) => {
    return await file.find({ Title });
  },

  getPaginatedFiles: async (searchTerm, page, limit) => {
    const skip = (page - 1) * limit;
    const query = {
      $or: [
        { Title: { $regex: searchTerm, $options: "i" } },
        { "Conference.Conference_Name": { $regex: searchTerm, $options: "i" } },
      ],
    };
    const totalCount = await file.countDocuments(query);
    const results = await file.find(query).skip(skip).limit(limit);
    return { results, totalCount };
  },

  findByTitleAndAuthor: async (title, authorEmail) => {
    return await file.findOne({
      Title: title,
      Author_Mail: { $elemMatch: { Author_Mail: authorEmail } },
    });
  },
};

module.exports = fileModel;