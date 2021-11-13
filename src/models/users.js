module.exports = (mongoose) => {
  const Schema = mongoose.Schema;
  return mongoose.model(
    "Users",
    new Schema({
      pseudo: { type: String, index: true },
      idDiscord: { type: String, index: { unique: true } },
      x: { type: Number, index: true },
      y: { type: Number, index: true },
    })
  );
};
