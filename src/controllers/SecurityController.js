import Security from "../models/Security";

export const addSecurity = async (req, res) => {
  try {
    const { security, ticker_symbol, current_price } = req.body;
    // console.log(req.body);
    const result = await Security.create({
      security,
      ticker_symbol,
      current_price,
    });
    res.json(result);
  } catch (error) {
    res.json(error);
  }
};

export const deleteSecurity = async (req, res) => {
  try {
    const { security_id } = req.body;
    // console.log(req.body);
    const result = await Security.findByIdAndDelete({ _id: security_id });
    res.json(result);
  } catch (error) {
    res.json(error);
  }
};
export const updateSecurity = async (req, res) => {
  const { security_id, updated_current_price } = req.body;
  const result = await Security.findByIdAndUpdate(
    security_id,
    {
      current_price: updated_current_price,
    },
    { returnOriginal: false }
  );
  res.json(result);
};
// export const getAllSecurity = async (req, res) => {
//   const result = await Security.find({});
//   res.json(result);
// };

export const getSecurity = async (req, res) => {
  //if ticker symbol set is provided
  if (req.body && req.body.ticket_symbol_id_set) {
    const { ticket_symbol_id_set } = req.body;
    console.log(ticket_symbol_id_set);
    const result = await Security.find({
      _id: { $in: ticket_symbol_id_set },
    });
    res.json(result);
  } else {
    const result = await Security.find({});
    res.json(result);
  }
};
