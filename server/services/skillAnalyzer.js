const natural = require('natural');
const knownSkills = ['JavaScript', 'Python', 'React', 'Node.js', 'MongoDB', 'SQL', 'AWS', 'Docker'];

exports.extractSkills = (text) => {
  const tokenizer = new natural.WordTokenizer();
  const tokens = tokenizer.tokenize(text);
  return knownSkills.filter(skill => tokens.includes(skill));
};
