let linguist;

const loadLinguist = async () => {
  if (!linguist) {
    linguist = await import("linguist");
  }
  return linguist;
};

module.exports = { loadLinguist };
