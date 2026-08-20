const RegistrationCounter = require(
  "../models/registrationCounter"
);

const generateRegistrationNumbers = async (count) => {
  const year = new Date().getFullYear();

  const counterKey = `WEB-${year}`;

  const counter = await RegistrationCounter.findOneAndUpdate(
    {
      _id: counterKey,
    },
    {
      $inc: {
        seq: count,
      },
    },
    {
      new: true,
      upsert: true,
    }
  );

  const lastNumber = counter.seq;
  const firstNumber = lastNumber - count + 1;

  const registrationNumbers = [];

  for (
    let number = firstNumber;
    number <= lastNumber;
    number++
  ) {
    registrationNumbers.push(
      `WEB/${year}/${String(number).padStart(3, "0")}`
    );
  }

  return registrationNumbers;
};

module.exports = generateRegistrationNumbers;