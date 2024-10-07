import walletDb from "../../models/schemas/walletSchema.js";

export const createOrUpdateWallet = async (req, res) => {
  const { userId, balance, transactions } = req.body;
  try {
    let wallet = await walletDb.findOne({ userId });
    if (wallet) {
      wallet.balance = balance !== undefined ? balance : wallet.balance;
      wallet.transactions = transactions || wallet.transactions;
      await wallet.save();
    } else {
      wallet = new walletDb({ userId, balance, transactions });
      await wallet.save();
    }
    res.status(201).json(wallet);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createWalletTransaction = async (req, res) => {
  const { userId, walletUpdate, total } = req.body;
  try {
    const wallet = await walletDb.findOne({ userId });
    if (!wallet) return res.status(404).send("Wallet not found");

    wallet.balance += walletUpdate === "credited" ? total : -total;
    wallet.transactions.push({
      order: null,
      walletUpdate,
      total,
      date: new Date(),
    });
    await wallet.save();

    res.json(wallet);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getWalletData = async (req, res) => {
  try {
    const wallet = await walletDb.findOne({ userId: req.params.id });
    if (!wallet) return res.status(404).send("Wallet not found");
    res.json(wallet);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
