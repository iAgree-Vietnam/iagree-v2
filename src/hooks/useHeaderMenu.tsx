"use client";

import { useMemo } from "react";
import type { MenuProps } from "antd";
import Link from "next/link";
import { useRouter } from "next/router";
import { Button, Typography, Menu, Popover } from "antd";
import { DownOutlined } from "@ant-design/icons";

import JobRouteUtils from "@/src/data/job/utils/JobRouteUtils";
import { PartnerRouteUtils } from "@/src/data/partner/utils/PartnerRouteUtils";
import TemplateRouteUtils from "@/src/data/template/utils/TemplateRouteUtils";
import AboutUsRouteUtils from "@/src/data/aboutus/utils/AboutUsRouteUtils";
import PricingRouteUtils from "@/src/data/pricing/utils/PricingRouteUtils";
import AuthJobRouteUtils from "@/src/data/auth/utils/AuthJobRouteUtils";
import Constants from "@/src/constants/Constants";

interface UseHeaderMenuProps {
  isActuallyLoggedIn: string | boolean | number | null;
  fullProfileResource: any;
}

export const useHeaderMenu = ({
  isActuallyLoggedIn,
  fullProfileResource,
}: UseHeaderMenuProps) => {
  const router = useRouter();

  const isPartner =
    fullProfileResource?.partner?.status === Constants.PARTNER.DA_DUYET;
  const checkPartnerProgressing =
    fullProfileResource?.partner?.status === Constants.PARTNER.CHO_DUYET;

  const getNotLoggedInMenu = (): MenuProps["items"] => [
    {
      key: "jobs",
      label: <Link href={JobRouteUtils.toJobsSearchScreen({})}>Công việc</Link>,
    },
    {
      key: "partners",
      label: <Link href={PartnerRouteUtils.toPartnersSearchScreen()}>Đối tác</Link>,
    },
    {
      key: "template-docs",
      label: <Link href={TemplateRouteUtils.toScreen({})}>Biểu mẫu</Link>,
    },
    {
      key: "pricing",
      label: <Link href={PricingRouteUtils.toScreen()}>Gói dịch vụ</Link>,
    },
    {
      key: "news",
      label: <Link href={"/news"}>Tin tức</Link>,
    },
    {
      key: "about-us",
      label: <Link href={AboutUsRouteUtils.toScreen()}>Về chúng tôi</Link>,
    },
  ];

  const getLoggedInNonPartnerMenu = (): MenuProps["items"] => [
    {
      key: "jobs",
      label: (
        <Popover
          placement={"bottomLeft"}
          trigger={"hover"}
          content={
            <Menu
              mode={"inline"}
              className={"headerPopoverMenu"}
              items={[
                {
                  key: "searchJobs",
                  label: (
                    <Link
                      href={JobRouteUtils.toJobsSearchScreen({})}
                      // onClick={() => {
                      //   router.push(JobRouteUtils.toScreen({}));
                      // }}
                    >
                      <Typography.Title level={5} className={"nm-typo"}>
                        Tất cả công việc
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
                      <Typography.Paragraph
                        className={"nm-typo"}
                        type={"secondary"}
                      >
                        Đăng tin tìm Đối tác cho công việc của bạn
                      </Typography.Paragraph>
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
              ]}
            />
          }
          arrow={false}
          overlayClassName={"headerPopover"}
        >
          <Button
            type={"text"}
            icon={<DownOutlined style={{ fontSize: 12 }} />}
            iconPosition={"end"}
          >
            Công việc
          </Button>
        </Popover>
      ),
    },
    {
      key: "partners",
      label: (
        <Link href={PartnerRouteUtils.toPartnersSearchScreen()}>Tìm kiếm Đối tác</Link>
      ),
    },
    {
      key: "template-docs",
      label: (
        <Popover
          placement={"bottomLeft"}
          trigger={"hover"}
          content={
            <Menu
              mode={"inline"}
              className={"headerPopoverMenu"}
              items={[
                {
                  key: "templateStore",
                  label: (
                    <Link
                      href={TemplateRouteUtils.toScreen({})}
                      onClick={() => {
                        router.push(TemplateRouteUtils.toScreen({}));
                      }}
                    >
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
              ]}
            />
          }
          arrow={false}
          overlayClassName={"headerPopover template"}
        >
          <Button
            type={"text"}
            icon={<DownOutlined style={{ fontSize: 12 }} />}
            iconPosition={"end"}
          >
            Biểu mẫu
          </Button>
        </Popover>
      ),
    },
    // {
    //   key: "contract",
    //   label: (
    //     <Popover
    //       placement={"bottomLeft"}
    //       trigger={"hover"}
    //       content={
    //         <Menu
    //           mode={"inline"}
    //           className={"headerPopoverMenu"}
    //           items={[
    //             {
    //               key: "uploadContract",
    //               label: (
    //                 <Link
    //                   href={ContractRouteUtils.toUploadScreen()}
    //                   onClick={() => {
    //                     router.push(ContractRouteUtils.toUploadScreen());
    //                   }}
    //                 >
    //                   <Typography.Title level={5} className={"nm-typo"}>
    //                     Đăng tài liệu ký
    //                   </Typography.Title>
    //                   <Typography.Paragraph
    //                     className={"nm-typo"}
    //                     type={"secondary"}
    //                   >
    //                     Đăng tài liệu và ký số ngay
    //                   </Typography.Paragraph>
    //                 </Link>
    //               ),
    //             },
    //             {
    //               key: "myContract",
    //               label: (
    //                 <Link
    //                   href={ContractRouteUtils.toScreen({})}
    //                   onClick={() => {
    //                     router.push(ContractRouteUtils.toScreen({}));
    //                   }}
    //                 >
    //                   <Typography.Title level={5} className={"nm-typo"}>
    //                     Quản lý tài liệu ký
    //                   </Typography.Title>
    //                 </Link>
    //               ),
    //             },
    //           ]}
    //         />
    //       }
    //       arrow={false}
    //       overlayClassName={"headerPopover template"}
    //     >
    //       <Button
    //         type={"text"}
    //         icon={<DownOutlined style={{ fontSize: 12 }} />}
    //         iconPosition={"end"}
    //       >
    //         Ký số trực tuyến
    //       </Button>
    //     </Popover>
    //   ),
    // },
    {
      key: "pricing",
      label: <Link href={PricingRouteUtils.toScreen()}>Gói dịch vụ</Link>,
    },
    {
      key: "news",
      label: <Link href={"/news"}>Tin tức</Link>,
    },
    {
      key: "about-us",
      label: <Link href={AboutUsRouteUtils.toScreen()}>Về chúng tôi</Link>,
    },
  ];

  const getLoggedInPartnerMenu = (): MenuProps["items"] => [
    {
      key: "jobs",
      label: (
        <Popover
          placement={"bottomLeft"}
          trigger={"hover"}
          content={
            <Menu
              mode={"inline"}
              className={"headerPopoverMenu"}
              items={[
                {
                  key: "searchJobs",
                  label: (
                    <Link
                      href={JobRouteUtils.toJobsSearchScreen({})}
                      // onClick={() => {
                      //   router.push(JobRouteUtils.toJobsSearchScreen({}));
                      // }}
                    >
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
                      <Typography.Paragraph
                        className={"nm-typo"}
                        type={"secondary"}
                      >
                        Đăng tin tìm Đối tác cho công việc của bạn
                      </Typography.Paragraph>
                    </Link>
                  ),
                },
                {
                  key: "jobManage",
                  label: (
                    <div
                      style={{
                        paddingRight: "20px",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <Typography.Title
                        level={5}
                        className={"nm-typo"}
                        style={{ margin: 0 }}
                      >
                        Quản lý công việc
                      </Typography.Title>
                    </div>
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
                          <Typography.Title level={5} className={"nm-typo"}>
                            Quản lý đăng tuyển
                          </Typography.Title>
                          <Typography.Paragraph
                            className={"nm-typo"}
                            type={"secondary"}
                          >
                            Quản lý công việc bạn đang tìm kiếm ứng viên thực
                            hiện
                          </Typography.Paragraph>{" "}
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
                          <Typography.Title level={5} className={"nm-typo"}>
                            Quản lý ứng tuyển
                          </Typography.Title>
                          <Typography.Paragraph
                            className={"nm-typo"}
                            type={"secondary"}
                          >
                            Quản lý công việc bạn đang thực hiện cho Khách hàng
                          </Typography.Paragraph>{" "}
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
                    //       <Typography.Title level={5} className={"nm-typo"}>
                    //         Công việc được mời
                    //       </Typography.Title>
                    //       <Typography.Paragraph
                    //         className={"nm-typo"}
                    //         type={"secondary"}
                    //       >
                    //         Quản lý công việc bạn được Khách hàng gửi lời mời
                    //       </Typography.Paragraph>{" "}
                    //     </Link>
                    //   ),
                    // },
                  ],
                },
              ]}
            />
          }
          arrow={false}
          overlayClassName={"headerPopover"}
        >
          <Button
            type={"text"}
            icon={<DownOutlined style={{ fontSize: 12 }} />}
            iconPosition={"end"}
          >
            Công việc
          </Button>
        </Popover>
      ),
    },
    {
      key: "partners",
      label: (
        <Popover
          placement={"bottomLeft"}
          trigger={"hover"}
          content={
            <Menu
              mode={"inline"}
              className={"headerPopoverMenu"}
              items={[
                {
                  key: "findPartner",
                  label: (
                    <Link
                      href={PartnerRouteUtils.toPartnersSearchScreen()}
                      // onClick={() => {
                      //   router.push(PartnerRouteUtils.toPartnersSearchScreen({}));
                      // }}
                    >
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
                      <Typography.Paragraph
                        className={"nm-typo"}
                        type={"secondary"}
                      >
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
                        router.push(
                          PartnerRouteUtils.toHowItWorksForPartners()
                        );
                      }}
                    >
                      <Typography.Title level={5} className={"nm-typo"}>
                        Cẩm nang Đối tác
                      </Typography.Title>
                    </Link>
                  ),
                },
              ]}
            />
          }
          arrow={false}
          overlayClassName={"headerPopover"}
        >
          <Button
            type={"text"}
            icon={<DownOutlined style={{ fontSize: 12 }} />}
            iconPosition={"end"}
          >
            Đối tác
          </Button>
        </Popover>
      ),
    },
    {
      key: "template-docs",
      label: (
        <Popover
          placement={"bottomLeft"}
          trigger={"hover"}
          content={
            <Menu
              mode={"inline"}
              className={"headerPopoverMenu"}
              items={[
                {
                  key: "templateStore",
                  label: (
                    <Link
                      href={TemplateRouteUtils.toScreen({})}
                      onClick={() => {
                        router.push(TemplateRouteUtils.toScreen({}));
                      }}
                    >
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
              ]}
            />
          }
          arrow={false}
          overlayClassName={"headerPopover template"}
        >
          <Button
            type={"text"}
            icon={<DownOutlined style={{ fontSize: 12 }} />}
            iconPosition={"end"}
          >
            Biểu mẫu
          </Button>
        </Popover>
      ),
    },
    // {
    //   key: "contract",
    //   label: (
    //     <Popover
    //       placement={"bottomLeft"}
    //       trigger={"hover"}
    //       content={
    //         <Menu
    //           mode={"inline"}
    //           className={"headerPopoverMenu"}
    //           items={[
    //             {
    //               key: "uploadContract",
    //               label: (
    //                 <Link
    //                   href={ContractRouteUtils.toUploadScreen()}
    //                   onClick={() => {
    //                     router.push(ContractRouteUtils.toUploadScreen());
    //                   }}
    //                 >
    //                   <Typography.Title level={5} className={"nm-typo"}>
    //                     Đăng tài liệu ký
    //                   </Typography.Title>
    //                   <Typography.Paragraph
    //                     className={"nm-typo"}
    //                     type={"secondary"}
    //                   >
    //                     Đăng tài liệu và ký số ngay
    //                   </Typography.Paragraph>
    //                 </Link>
    //               ),
    //             },
    //             {
    //               key: "myContract",
    //               label: (
    //                 <Link
    //                   href={ContractRouteUtils.toScreen({})}
    //                   onClick={() => {
    //                     router.push(ContractRouteUtils.toScreen({}));
    //                   }}
    //                 >
    //                   <Typography.Title level={5} className={"nm-typo"}>
    //                     Quản lý tài liệu ký
    //                   </Typography.Title>
    //                 </Link>
    //               ),
    //             },
    //           ]}
    //         />
    //       }
    //       arrow={false}
    //       overlayClassName={"headerPopover template"}
    //     >
    //       <Button
    //         type={"text"}
    //         icon={<DownOutlined style={{ fontSize: 12 }} />}
    //         iconPosition={"end"}
    //       >
    //         Ký số trực tuyến
    //       </Button>
    //     </Popover>
    //   ),
    // },
    {
      key: "pricing",
      label: <Link href={PricingRouteUtils.toScreen()}>Gói dịch vụ</Link>,
    },
    {
      key: "news",
      label: <Link href={"/news"}>Tin tức</Link>,
    },
    {
      key: "about-us",
      label: <Link href={AboutUsRouteUtils.toScreen()}>Về chúng tôi</Link>,
    },
  ];

  const headerMenu: MenuProps["items"] = useMemo(() => {
    if (!isActuallyLoggedIn) {
      return getNotLoggedInMenu();
    }

    if (isActuallyLoggedIn && !isPartner) {
      return getLoggedInNonPartnerMenu();
    }

    if (isActuallyLoggedIn && (isPartner || checkPartnerProgressing)) {
      return getLoggedInPartnerMenu();
    }

    return getNotLoggedInMenu();
  }, [isActuallyLoggedIn, isPartner, checkPartnerProgressing]);

  return { headerMenu };
};
