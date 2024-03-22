function age(DOB){
    const today = new Date();
      const age = Math.floor((today - DOB) / (365.25 * 24 * 60 * 60 * 1000));
      return age;
}

module.exports = age