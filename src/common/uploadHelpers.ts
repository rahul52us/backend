import * as path from 'path';
import * as fs from 'fs'

export class Helper {
  static customFileName(req: any, file: any, cb: any) {
    let fileExtension = '';
    if (file.mimetype.indexOf('jpeg') > -1) {
      fileExtension = 'jpg';
    } else if (file.mimetype.indexOf('png') > -1) {
      fileExtension = 'png';
    }
    cb(
      null,
      req.userId +
        Math.floor(Math.random() * 100 + 1) +
        path.extname(file.originalname),
    );
  }
  static destinationPath(req: any, file: any, cb: any) {
    cb(null, './public/upload_pic');
  }
}

export class HelperTestimonial {
  static customFileName(req: any, file: any, cb: any) {
    let fileExtension = '';
    if (file.mimetype.indexOf('jpeg') > -1) {
      fileExtension = 'jpg';
    } else if (file.mimetype.indexOf('png') > -1) {
      fileExtension = 'png';
    }
    cb(
      null,
      req.userId +
        Math.floor(Math.random() * 98 + 1) +
        path.extname(file.originalname),
    );
  }
  static destinationPath(req: any, file: any, cb: any) {
    cb(null, './public/testimonials');
  }
}

export const deleteTestimonialsFun = (pic : string) => {
  try
  {
  const parts = pic.split('/')
  if (fs.existsSync(path.join(path.resolve(__dirname,'../..'),`/public/testimonials/${parts[parts.length - 1]}`))) {
      fs.unlinkSync(path.join(path.resolve(__dirname,'../..'),`/public/testimonials/${parts[parts.length - 1]}`));
    }
  }catch(err){
  }
}