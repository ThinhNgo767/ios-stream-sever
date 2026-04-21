const { ObjectId } = require("mongodb");

const filteredUpdate = async (body, hashtags, id) => {
  try {
    const hashtag = await hashtags.findOne({
      _id: new ObjectId(id),
    });

    if (!hashtag) {
      throw new Error("Hashtag does not exist!");
    }

    return Object.fromEntries(
      Object.entries(body).filter(([key, value]) => {
        const isEmptyString = value === "" || value === null;
        const isDuplicate =
          hashtag.hasOwnProperty(key) && hashtag[key] === value;
        return !isEmptyString && !isDuplicate;
      }),
    );
  } catch (error) {
    console.error(error);
  }
};

module.exports = filteredUpdate;
