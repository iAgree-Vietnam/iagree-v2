// import {FileUtil} from "@/common/utils/file.util";
// import {ConstantConfig} from "@/common/config/constant.config";
// import {WordpressService} from "@/services/wp/wordpress.service";
// import { Videos } from "next/dist/lib/metadata/types/metadata-types";
// import { Languages } from "next/dist/lib/metadata/types/alternative-urls-types";
import { ConstantsHelper } from "./constants/ConstantsHelper";
import BackendTemplateServices from "./data/template/services/BackendTemplateServices";

export default async function sitemap(): Promise<
  Array<
    | {
        changeFrequency: string;
        lastModified: Date;
        priority: number;
        url: string;
      }
    | {
        url: string;
        lastModified?: string | Date;
        changeFrequency?:
          | "always"
          | "hourly"
          | "daily"
          | "weekly"
          | "monthly"
          | "yearly"
          | "never";
        priority?: number;
        // alternates?: { languages?: Languages<string> };
        images?: string[];
        // videos?: Videos[];
      }
  >
> {

    // const apiRes = await new BackendTemplateServices().get({});

  // const postsPromise = WordpressService.gI().posts.getPosts({
  //     status: "publish",
  //     _fields: "slug",
  // })

  // const categoriesPromise = WordpressService.gI().product.categories.getBy({
  //     _fields: "slug"
  // })

  // const productsPromise = WordpressService.gI().product.getProducts({
  //     status: "publish",
  //     _fields: "slug,categories,date_modified_gmt"
  // })
  // const [posts, categories, products] = await Promise.all([postsPromise, categoriesPromise, productsPromise])

  // const list = FileUtil.listFilesSync("assets/html")
  //     .map(file => file.replace(".html", ""))
  //     .map(file => {
  //         return {
  //             url: `${ConstantConfig.BASE_URL}/${file}`,
  //             changeFrequency: "weekly",
  //             priority: 1,
  //             lastModified: new Date()
  //         }
  //     })
  return [
    ...ConstantsHelper.DEFAULT_SITEMAP(),
    // ...list,
    // ...(posts || []).map(post => {
    //     return {
    //         url: `${ConstantConfig.BASE_URL}/bai-viet/${post.slug}`,
    //         changeFrequency: "weekly",
    //         priority: 0.8,
    //         lastModified: new Date(post.date_gmt || new Date())
    //     }
    // }),
    // ...(categories || []).map(category => {
    //     return {
    //         url: `${ConstantConfig.BASE_URL}/san-pham/${category.slug}`,
    //         changeFrequency: "weekly",
    //         priority: 0.8,
    //         lastModified: new Date()
    //     }
    // }),
    // ...(products || []).map(product => {
    //     const category = (product?.categories?.length || 0) > 0 ? (product?.categories || [{slug: ""}])[0] : {slug: ""}
    //     return {
    //         url: `${ConstantConfig.BASE_URL}/san-pham/${category.slug}/${product.slug}`,
    //         changeFrequency: "weekly",
    //         priority: 0.8,
    //         lastModified: new Date(product.date_modified_gmt || new Date())
    //     }
    // })
  ];
}
