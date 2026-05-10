const calculateDeliveryDate = () => {

  const date = new Date();

  date.setDate(
    date.getDate() + 5
  );

  return date;

};

module.exports =
calculateDeliveryDate;