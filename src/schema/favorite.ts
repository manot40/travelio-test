import Joi from 'joi';

export const favoriteSchema = Joi.object({
  title: Joi.string().required(),
  authors: Joi.array().items(Joi.string()),
  publisher: Joi.string(),
  publishedDate: Joi.date(),
  description: Joi.string(),
  ratingsCount: Joi.number(),
  averageRating: Joi.number(),
  image: Joi.string(),
});
