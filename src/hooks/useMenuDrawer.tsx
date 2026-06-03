"use client";

import { useMemo } from "react";
import { type MenuProps, Typography } from "antd";
import Link from "next/link";
import { useRouter } from "next/router";

import JobRouteUtils from "@/src/data/job/utils/JobRouteUtils";
import AuthJobRouteUtils from "@/src/data/auth/utils/AuthJobRouteUtils";
import { PartnerRouteUtils } from "@/src/data/partner/utils/PartnerRouteUtils";
import ContractRouteUtils from "@/src/data/contract/utils/ContractRouteUtils";
import TemplateRouteUtils from "@/src/data/template/utils/TemplateRouteUtils";
import PricingRouteUtils from "@/src/data/pricing/utils/PricingRouteUtils";
import AboutUsRouteUtils from "@/src/data/aboutus/utils/AboutUsRouteUtils";
import Constants from "@/src/constants/Constants";

interface UseMenuDrawerProps {
  isActuallyLoggedIn: string | boolean | number | null;
  fullProfileResource: any;
}

export const useMenuDrawer = ({
  isActuallyLoggedIn,
  fullProfileResource,
}: UseMenuDrawerProps) => {
  const router = useRouter();

  const isPartner =
    fullProfileResource?.partner?.status === Constants.PARTNER.DA_DUYET;
  const checkPartnerProgressing =
    fullProfileResource?.partner?.status === Constants.PARTNER.CHO_DUYET;

  const getNotLoggedInMenu = (): MenuProps["items"] => [
    {
      key: "home",
      label: (
        <Link href={"/"}>
          <Typography.Title level={4} className={"nm-typo"}>
            Trang chủ
          </Typography.Title>
        </Link>
      ),
    },
    {
      key: "jobs",
      label: (
        <Link href={JobRouteUtils.toJobsSearchScreen({})}>
          <Typography.Title level={4} className={"nm-typo"}>
            Công việc
          </Typography.Title>
        </Link>
      ),
    },
    {
      key: "partners",
      label: (
        <Link href={PartnerRouteUtils.toPartnersSearchScreen()}>
          <Typography.Title level={4} className={"nm-typo"}>
            Đối tác
          </Typography.Title>
        </Link>
      ),
    },
    {
      key: "template-docs",
      label: (
        <Link href={TemplateRouteUtils.toScreen({})}>
          <Typography.Title level={4} className={"nm-typo"}>
            Biểu mẫu
          </Typography.Title>
        </Link>
      ),
    },
    {
      key: "pricing",
      label: (
        <Link href={PricingRouteUtils.toScreen()}>
          <Typography.Title level={4} className={"nm-typo"}>
            Gói dịch vụ
          </Typography.Title>
        </Link>
      ),
    },
    {
      key: "news",
      label: (
        <Link href={"/news"}>
          <Typography.Title level={4} className={"nm-typo"}>
            Tin tức
          </Typography.Title>
        </Link>
      ),
    },
    {
      key: "about-us",
      label: (
        <Link href={AboutUsRouteUtils.toScreen()}>
          <Typography.Title level={4} className={"nm-typo"}>
            Về chúng tôi
          </Typography.Title>
        </Link>
      ),
    },
  ];

  const getLoggedInNonPartnerMenu = (): MenuProps["items"] => [
    {
      key: "home",
      label: (
        <Link href={"/"}>
          <Typography.Title level={4} className={"nm-typo"}>
            Trang chủ
          </Typography.Title>
        </Link>
      ),
    },
    {
      key: "jobs",
      label: (
        <Typography.Title level={4} className={"nm-typo"}>
          Công việc
        </Typography.Title>
      ),
      children: [
        {
          key: "hiring",
          label: (
            <Link
              href={JobRouteUtils.toAddScreen()}
              onClick={() => {
                router.push(JobRouteUtils.toAddScreen());
              }}
            >
              <Typography.Title level={5} className={"nm-typo"}>
                Đăng tải công việc
              </Typography.Title>
            </Link>
          ),
        },
        {
          key: "jobManageHiring",
          label: (
            <Link
              href={AuthJobRouteUtils.toManagementUrl()}
              onClick={() => {
                router.push(AuthJobRouteUtils.toManagementUrl());
              }}
            >
              <Typography.Title level={5} className={"nm-typo"}>
                Quản lý công việc đăng tuyển
              </Typography.Title>
            </Link>
          ),
        },
      ],
    },
    {
      key: "partners",
      label: (
        <Link href={PartnerRouteUtils.toPartnersSearchScreen()}>
          <Typography.Title level={4} className={"nm-typo"}>
            Tìm kiếm Đối tác
          </Typography.Title>
        </Link>
      ),
    },
    {
      key: "template-docs",
      label: (
        <Typography.Title level={4} className={"nm-typo"}>
          Biểu mẫu
        </Typography.Title>
      ),
      children: [
        {
          key: "templateStore",
          label: (
            <Link href={TemplateRouteUtils.toScreen({})}>
              <Typography.Title level={5} className={"nm-typo"}>
                Kho biểu mẫu
              </Typography.Title>
            </Link>
          ),
        },
        {
          key: "myTemplate",
          label: (
            <Link
              href={TemplateRouteUtils.toTemplateManageUrl(
                Constants.TEMPLATE.STATUS.MINE
              )}
              onClick={() => {
                router.push(
                  TemplateRouteUtils.toTemplateManageUrl(
                    Constants.TEMPLATE.STATUS.MINE
                  )
                );
              }}
            >
              <Typography.Title level={5} className={"nm-typo"}>
                Biểu mẫu của tôi
              </Typography.Title>
            </Link>
          ),
        },
        {
          key: "boughtTemplate",
          label: (
            <Link
              href={TemplateRouteUtils.toTemplateManageUrl(
                Constants.TEMPLATE.STATUS.PAID
              )}
              onClick={() => {
                router.push(
                  TemplateRouteUtils.toTemplateManageUrl(
                    Constants.TEMPLATE.STATUS.PAID
                  )
                );
              }}
            >
              <Typography.Title level={5} className={"nm-typo"}>
                Biểu mẫu đã mua
              </Typography.Title>
            </Link>
          ),
        },
        {
          key: "savedTemplate",
          label: (
            <Link
              href={TemplateRouteUtils.toTemplateManageUrl(
                Constants.TEMPLATE.STATUS.SAVED
              )}
              onClick={() => {
                router.push(
                  TemplateRouteUtils.toTemplateManageUrl(
                    Constants.TEMPLATE.STATUS.SAVED
                  )
                );
              }}
            >
              <Typography.Title level={5} className={"nm-typo"}>
                Biểu mẫu đã lưu
              </Typography.Title>
            </Link>
          ),
        },
      ],
    },
    // {
    //   key: "contract",
    //   label: (
    //     <Typography.Title level={4} className={"nm-typo"}>
    //       Ký số trực tuyến
    //     </Typography.Title>
    //   ),
    //   children: [
    //     {
    //       key: "uploadContract",
    //       label: (
    //         <Link
    //           href={ContractRouteUtils.toUploadScreen()}
    //           onClick={() => {
    //             router.push(ContractRouteUtils.toUploadScreen());
    //           }}
    //         >
    //           <Typography.Title level={5} className={"nm-typo"}>
    //             Đăng tài liệu ký
    //           </Typography.Title>
    //           <Typography.Paragraph className={"nm-typo"} type={"secondary"}>
    //             Đăng tài liệu và ký số ngay
    //           </Typography.Paragraph>
    //         </Link>
    //       ),
    //     },
    //     {
    //       key: "myContract",
    //       label: (
    //         <Link
    //           href={ContractRouteUtils.toScreen({})}
    //           onClick={() => {
    //             router.push(ContractRouteUtils.toScreen({}));
    //           }}
    //         >
    //           <Typography.Title level={5} className={"nm-typo"}>
    //             Quản lý tài liệu ký
    //           </Typography.Title>
    //         </Link>
    //       ),
    //     },
    //   ],
    // },
    {
      key: "pricing",
      label: (
        <Link href={PricingRouteUtils.toScreen()}>
          <Typography.Title level={4} className={"nm-typo"}>
            Gói dịch vụ
          </Typography.Title>
        </Link>
      ),
    },
    {
      key: "news",
      label: (
        <Link href={"/news"}>
          <Typography.Title level={4} className={"nm-typo"}>
            Tin tức
          </Typography.Title>
        </Link>
      ),
    },
  ];

  const getLoggedInPartnerMenu = (): MenuProps["items"] => [
    {
      key: "home",
      label: (
        <Link href={"/"}>
          <Typography.Title level={4} className={"nm-typo"}>
            Trang chủ
          </Typography.Title>
        </Link>
      ),
    },
    {
      key: "jobs",
      label: (
        <Typography.Title level={4} className={"nm-typo"}>
          Công việc
        </Typography.Title>
      ),
      children: [
        {
          key: "searchJobs",
          label: (
            <Link href={JobRouteUtils.toJobsSearchScreen({})}>
              <Typography.Title level={5} className={"nm-typo"}>
                Tìm kiếm công việc
              </Typography.Title>
            </Link>
          ),
        },
        {
          key: "hiring",
          label: (
            <Link
              href={JobRouteUtils.toAddScreen()}
              onClick={() => {
                router.push(JobRouteUtils.toAddScreen());
              }}
            >
              <Typography.Title level={5} className={"nm-typo"}>
                Đăng tải công việc
              </Typography.Title>
            </Link>
          ),
        },
        {
          key: "jobManage",
          label: (
            <Typography.Title level={5} className={"nm-typo"}>
              Quản lý công việc
            </Typography.Title>
          ),
          children: [
            {
              key: "jobManageHiring",
              label: (
                <Link
                  href={AuthJobRouteUtils.toManagementUrl()}
                  onClick={() => {
                    router.push(AuthJobRouteUtils.toManagementUrl());
                  }}
                >
                  Quản lý đăng tuyển
                </Link>
              ),
            },
            {
              key: "jobManageApply",
              label: (
                <Link
                  href={AuthJobRouteUtils.toApplyUrl()}
                  onClick={() => {
                    router.push(AuthJobRouteUtils.toApplyUrl());
                  }}
                >
                  Quản lý ứng tuyển
                </Link>
              ),
            },
            // {
            //   key: "jobManageInvited",
            //   label: (
            //     <Link
            //       href={AuthJobRouteUtils.toInvitedUrl()}
            //       onClick={() => {
            //         router.push(AuthJobRouteUtils.toInvitedUrl());
            //       }}
            //     >
            //       Công việc được mời
            //     </Link>
            //   ),
            // },
          ],
        },
      ],
    },
    {
      key: "partners",
      label: (
        <Typography.Title level={4} className={"nm-typo"}>
          Đối tác
        </Typography.Title>
      ),
      children: [
        {
          key: "findPartner",
          label: (
            <Link href={PartnerRouteUtils.toPartnersSearchScreen()}>
              <Typography.Title level={5} className={"nm-typo"}>
                Tìm kiếm Đối tác
              </Typography.Title>
            </Link>
          ),
        },
        {
          key: "myProfile",
          label: (
            <Link
              href={PartnerRouteUtils.toProfileUrl()}
              onClick={() => {
                router.push(PartnerRouteUtils.toProfileUrl());
              }}
            >
              <Typography.Title level={5} className={"nm-typo"}>
                Thông tin của tôi
              </Typography.Title>
              <Typography.Paragraph className={"nm-typo"} type={"secondary"}>
                Điều chỉnh thông tin với vai trò Đối Tác của bạn
              </Typography.Paragraph>
            </Link>
          ),
        },
        {
          key: "myProfile",
          label: (
            <Link
              href={PartnerRouteUtils.toHowItWorksForPartners()}
              onClick={() => {
                router.push(PartnerRouteUtils.toHowItWorksForPartners());
              }}
            >
              <Typography.Title level={5} className={"nm-typo"}>
                Cẩm nang Đối tác
              </Typography.Title>
            </Link>
          ),
        },
      ],
    },
    {
      key: "template-docs",
      label: (
        <Typography.Title level={4} className={"nm-typo"}>
          Biểu mẫu
        </Typography.Title>
      ),
      children: [
        {
          key: "templateStore",
          label: (
            <Link href={TemplateRouteUtils.toScreen({})}>
              <Typography.Title level={5} className={"nm-typo"}>
                Kho biểu mẫu
              </Typography.Title>
            </Link>
          ),
        },
        {
          key: "myTemplate",
          label: (
            <Link
              href={TemplateRouteUtils.toTemplateManageUrl(
                Constants.TEMPLATE.STATUS.MINE
              )}
              onClick={() => {
                router.push(
                  TemplateRouteUtils.toTemplateManageUrl(
                    Constants.TEMPLATE.STATUS.MINE
                  )
                );
              }}
            >
              <Typography.Title level={5} className={"nm-typo"}>
                Biểu mẫu của tôi
              </Typography.Title>
            </Link>
          ),
        },
        {
          key: "boughtTemplate",
          label: (
            <Link
              href={TemplateRouteUtils.toTemplateManageUrl(
                Constants.TEMPLATE.STATUS.PAID
              )}
              onClick={() => {
                router.push(
                  TemplateRouteUtils.toTemplateManageUrl(
                    Constants.TEMPLATE.STATUS.PAID
                  )
                );
              }}
            >
              <Typography.Title level={5} className={"nm-typo"}>
                Biểu mẫu đã mua
              </Typography.Title>
            </Link>
          ),
        },
        {
          key: "savedTemplate",
          label: (
            <Link
              href={TemplateRouteUtils.toTemplateManageUrl(
                Constants.TEMPLATE.STATUS.SAVED
              )}
              onClick={() => {
                router.push(
                  TemplateRouteUtils.toTemplateManageUrl(
                    Constants.TEMPLATE.STATUS.SAVED
                  )
                );
              }}
            >
              <Typography.Title level={5} className={"nm-typo"}>
                Biểu mẫu đã lưu
              </Typography.Title>
            </Link>
          ),
        },
      ],
    },
    // {
    //   key: "contract",
    //   label: (
    //     <Typography.Title level={4} className={"nm-typo"}>
    //       Ký số trực tuyến
    //     </Typography.Title>
    //   ),
    //   children: [
    //     {
    //       key: "uploadContract",
    //       label: (
    //         <Link
    //           href={ContractRouteUtils.toUploadScreen()}
    //           onClick={() => {
    //             router.push(ContractRouteUtils.toUploadScreen());
    //           }}
    //         >
    //           <Typography.Title level={5} className={"nm-typo"}>
    //             Đăng tài liệu ký
    //           </Typography.Title>
    //           <Typography.Paragraph className={"nm-typo"} type={"secondary"}>
    //             Đăng tài liệu và ký số ngay
    //           </Typography.Paragraph>
    //         </Link>
    //       ),
    //     },
    //     {
    //       key: "myContract",
    //       label: (
    //         <Link
    //           href={ContractRouteUtils.toScreen({})}
    //           onClick={() => {
    //             router.push(ContractRouteUtils.toScreen({}));
    //           }}
    //         >
    //           <Typography.Title level={5} className={"nm-typo"}>
    //             Quản lý tài liệu ký
    //           </Typography.Title>
    //         </Link>
    //       ),
    //     },
    //   ],
    // },
    {
      key: "pricing",
      label: (
        <Link href={PricingRouteUtils.toScreen()}>
          <Typography.Title level={4} className={"nm-typo"}>
            Gói dịch vụ
          </Typography.Title>
        </Link>
      ),
    },
    {
      key: "news",
      label: (
        <Link href={"/news"}>
          <Typography.Title level={4} className={"nm-typo"}>
            Tin tức
          </Typography.Title>
        </Link>
      ),
    },
  ];

  const menu = useMemo(() => {
    // Condition 1: Not logged in
    if (!isActuallyLoggedIn) {
      return getNotLoggedInMenu();
    }

    // Condition 2: Logged in but not partner
    if (isActuallyLoggedIn && !isPartner) {
      return getLoggedInNonPartnerMenu();
    }

    // Condition 3: Logged in and is partner (or progressing)
    if (isActuallyLoggedIn && (isPartner || checkPartnerProgressing)) {
      return getLoggedInPartnerMenu();
    }

    // Fallback to not logged in menu
    return getNotLoggedInMenu();
  }, [isActuallyLoggedIn, isPartner, checkPartnerProgressing]);

  return { menu };
};
