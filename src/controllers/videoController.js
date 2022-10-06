import Video from "../model/Video";
import User from "../model/User";
import Comment from "../model/Comment";
import { async } from "regenerator-runtime";

export const home = async (req, res) => {
  try {
    const videos = await Video.find({})
      .sort({ createdAt: "desc" })
      .populate("owner");
    return res.render("home", { headTitle: "home", videos });
  } catch {}
};
export const see = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id).populate("owner").populate("comment");

  if (!video) {
    return res.status(404).render("404", { headTitle: "video not found" });
  }
  return res.render("watch", { headTitle: video.title, video });
};
export const getEdit = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id);
  const {
    session: {
      user: { _id },
    },
  } = req;

  if (!video) {
    return res.status(404).render("404", { headTitle: "video not found" });
  }
  if (String(video.owner) !== String(_id)) {
    return res.status(403).redirect("/");
  }

  return res.render("edit", { headTitle: `editing ${video.title}`, video });
};

export const postEdit = async (req, res) => {
  const { title, description, hashtags } = req.body;
  const { id } = req.params;
  const video = await Video.findById(id);
  const {
    session: {
      user: { _id },
    },
  } = req;
  if (!video) {
    return res.status(404).render("404", { headTitle: "video not found" });
  }
  if (String(video.owner) !== String(_id)) {
    return res.status(403).redirect("/");
  }
  await Video.findByIdAndUpdate(id, {
    title,
    description,
    hashtags: Video.formatHashtags(hashtags),
  });

  req.flash("success", "Changes saved.");
  return res.redirect(`/video/${id}`);
};

export const getUpload = (req, res) => {
  res.header("Cross-Origin-Embedder-Policy", "require-corp");
  res.header("Cross-Origin-Opener-Policy", "same-origin");
  return res.render("upload", { headTitle: "upload video" });
};

export const postUpload = async (req, res) => {
  const {
    session: {
      user: { _id },
    },
  } = req;
  const { title, description, hashtags } = req.body;
  const { video, thumb } = req.files;
  try {
    const newVideo = await Video.create({
      title,
      videoUrl: video[0].location,
      thumbUrl: thumb[0].location,
      owner: _id,
      description,
      hashtags: Video.formatHashtags(hashtags),
    });
    const user = await User.findById(_id);
    user.videos.push(newVideo._id);
    await user.save();

    return res.redirect("/");
  } catch (error) {
    return res.status(400).render("upload", {
      headTitle: "upload video",
      errorMessage: error._message,
    });
  }
};

export const getDelete = async (req, res) => {
  const { id } = req.params;
  const {
    session: {
      user: { _id },
    },
  } = req;

  const video = await Video.findById(id);
  const user = await User.findById(_id);

  if (!video) {
    return res.status(404).render("404", { headTitle: "video not found" });
  }
  if (String(video.owner) !== String(_id)) {
    return res.status(403).redirect("/");
  }
  await Video.findByIdAndDelete(id);
  user.videos.splice(user.videos.indexOf(id), 1);
  await user.save();

  return res.redirect("/");
};

export const search = async (req, res) => {
  const { keyword } = req.query;
  let videos = [];
  if (keyword) {
    videos = await Video.find({
      title: {
        $regex: new RegExp(keyword, "i"),
      },
    }).populate("owner");
  }
  return res.render("search", { headTitle: "search", videos });
};

export const registerViews = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id);

  if (!video) {
    return res.sendStatus(404);
  }
  video.meta.views = video.meta.views + 1;
  await video.save();
  return res.sendStatus(200);
};

export const postComments = async (req, res) => {
  const {
    params: { id },
    body: { text },
    session: {
      user: { _id },
    },
  } = req;

  const video = await Video.findById(id);
  if (!video) {
    return res.sendStatus(404);
  }
  const comment = await Comment.create({
    owner: _id,
    text,
    video: id,
  });
  video.comment.push(comment._id);
  await video.save();
  return res.status(201).json({ commentId: comment._id });
};

export const deleteComments = async (req, res) => {
  const {
    params: { id },
    session: {
      user: { _id },
    },
  } = req;

  const selectedComment = await Comment.findById(id);

  if (String(selectedComment.owner) !== String(_id)) {
    return res.status(403).redirect("/");
  }
  const result = await Comment.findByIdAndDelete(id);
  if (result) {
    return res.sendStatus(200);
  } else {
    return res.sendStatus(500);
  }
};
