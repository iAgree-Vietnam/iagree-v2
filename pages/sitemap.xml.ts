import { GetServerSideProps } from "next";
import { ConstantsHelper } from "@/src/constants/ConstantsHelper";
import { MetadataRoute } from "next";
import JobServices from "@/src/data/job/services/JobServices";
import { compact, isEmpty, map } from "lodash";
import StringUtils from "@/src/utils/StringUtils";
import axios from "axios";
import PartnerServices from "@/src/data/partner/services/PartnerServices";

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  // Gọi hàm DEFAULT_SITEMAP() từ ConstantsHelper
  const sitemapItems = ConstantsHelper.DEFAULT_SITEMAP();
  // const url = process.env.FRONTEND_BASE_URL || "http://localhost:3000";
  // const PER_PAGE = 50;

  // Lấy số trang cần thiết
  // const jobService = new JobServices();
  // const partnerService = new PartnerServices();

  // const [jobs, partners, boxes] = await Promise.all([
  //   jobService.get({
  //     status: [1, 4],
  //     per_page: 1, // Chỉ lấy 1 công việc để biết tổng số công việc
  //   }),
  //   partnerService.get({}),
  //   jobService.getSelectBoxes(),
  // ]);

  // const totalJobPages = Math.ceil(jobs.total / PER_PAGE);
  // const totalPartnerPages = Math.ceil(partners?.total / PER_PAGE);
  // const totalBoxesPages = Math.ceil(boxes?.salaries?.total / PER_PAGE);

  // let listPartner: { url: string; lastModified: Date }[] = [];

  // // Lặp qua từng trang để lấy tất cả công việc
  // for (let page = 1; page <= totalPartnerPages; page++) {
  //   const { items } = await partnerService.get({});

  //   const pagePartnerList = compact(
  //     map(items, (it) => {
  //       return !isEmpty(it.username)
  //         ? {
  //             url: `${url}/partners/${StringUtils.slugify(
  //               it?.username || ""
  //             )}.${it.userId}`,
  //             lastModified: new Date(),
  //           }
  //         : null;
  //     })
  //   );

  //   // Gộp kết quả vào listJob
  //   listPartner = [...listPartner, ...pagePartnerList];
  // }

  // // Mảng lưu các URL công việc
  // let listJob: { url: string; lastModified: Date }[] = [];

  // // Lặp qua từng trang để lấy tất cả công việc
  // for (let page = 1; page <= totalJobPages; page++) {
  //   const { items } = await jobService.get({
  //     status: [1, 4],
  //     per_page: PER_PAGE,
  //     page,
  //   });

  //   const pageJobList = compact(
  //     map(items, (it) => {
  //       return !isEmpty(it.name)
  //         ? {
  //             url: `${url}/jobs/${StringUtils.slugify(it.name)}-${it.jobId}`,
  //             lastModified: new Date(),
  //           }
  //         : null;
  //     })
  //   );

  //   // Gộp kết quả vào listJob
  //   listJob = [...listJob, ...pageJobList];
  // }

  // Tạo nội dung XML hợp lệ
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${(
      [
        ...sitemapItems,
        // ...listJob,
        // ...listPartner
      ] as MetadataRoute.Sitemap
    )
      .map(
        (item) => `
      <url>
        <loc>${item.url}</loc>
        <lastmod>${item.lastModified}</lastmod>
      </url>`
      )
      .join("")}
  </urlset>`;

  // Gửi XML ra response
  res.setHeader("Content-Type", "text/xml");
  res.write(sitemap);
  res.end();

  return { props: {} };
};

// Không render HTML ra UI
export default function Sitemap() {
  return null;
}
