import mongoose from 'mongoose';

const TodoSchema = new mongoose.Schema(
  {
    title: String,
    status: String,
  },
  {
    timestamps: true,
  },
);
export default mongoose.model('Todo', TodoSchema);
