"use client";

import React, { useMemo } from "react";
import { useRouter } from "next/router";
import { Row, Col, Button, Typography } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import moment from "moment";

import datetimeUtils from "@/src/utils/DatetimeUtils";
import { NotificationResource } from "@/src/data/notification/models/notification.types";
import Constants from "@/src/constants/Constants";
import JobRouteUtils from "@/src/data/job/utils/JobRouteUtils";
import { useUpdateNotification } from "@/src/screens/ProfileScreen/hooks/useUpdateNotification";
import PricingRouteUtils from "@/src/data/pricing/utils/PricingRouteUtils";
import AuthRouteUtils from "@/src/data/auth/utils/AuthRouteUtils";
import { includes, isEmpty, last } from "lodash";

export interface NotificationItemProps {
  dataItem: NotificationResource;
  checked?: boolean;
  toggleOne?: (id: number, checked: boolean) => void;
  onOpenDeleteModal?: (notificationId: number) => void;
  isMobile?: boolean;
}

export function NotificationItem({
  dataItem,
  onOpenDeleteModal,
  isMobile,
}: NotificationItemProps) {
  const router = useRouter();
  const updateMutation = useUpdateNotification();

  const isDetails = useMemo(
    () => Boolean(onOpenDeleteModal),
    [onOpenDeleteModal]
  );
  const isMessNoti = includes(dataItem?.description, `{"id":`);
  const jsonData = isMessNoti ? JSON.parse(dataItem?.description) : {};

  const normalizeDesc = useMemo(() => {
    const regex = new RegExp(["&nbsp;", "<p>", "</p>", "<br>"].join("|"), "gi");
    return dataItem.description
      // .replaceAll(":", ": ")
      .replace(/:(?!\/)/g, ": ")
      .replaceAll(",", ", ")
      .replaceAll("Khách hàng", "Khách hàng ")
      .replace(regex, "");
  }, [dataItem.description]);

  // ---- Time display: Hôm nay/Hôm qua/Ngày thường ----
  const displayTime = useMemo(() => {
    const m = datetimeUtils.getMoment(dataItem.created_at);
    if (!m) return "";
    const isToday = m.isSame(moment(), "day");
    const isYesterday = m.isSame(moment().subtract(1, "day"), "day");
    if (isToday) return m.format("[Hôm nay] HH:mm");
    if (isYesterday) return m.format("[Hôm qua] HH:mm");
    return m.format(datetimeUtils.LOCAL_DATE_TIME_WITH_MERIDIEM);
  }, [dataItem.created_at]);

  const onClickNotification = () => {
    if (isMessNoti)
      router.push({
        pathname: "/chat",
        query: {
          chat_room: dataItem?.name || "",
        },
      });
    switch (dataItem.type) {
      case Constants.NOTIFICATION.TYPE.SYSTEM_NOTIFICATION:
        break;
      case Constants.NOTIFICATION.TYPE.TEMPLATE_NOTIFICATION:
        break;
      case Constants.NOTIFICATION.TYPE.JOB_NOTIFICATION: {
        if (dataItem.type_id) {
          router.push(
            JobRouteUtils.toDetailUrl({
              name: dataItem.itemName || "",
              jobId: dataItem.type_id,
            })
          );
        } else if (router.pathname !== AuthRouteUtils.toNotification()) {
          router.push(AuthRouteUtils.toNotification());
        }
        break;
      }
      case Constants.NOTIFICATION.TYPE.PRICING_NOTIFICATION: {
        router.push(PricingRouteUtils.toScreen());
        break;
      }
    }

    if (dataItem.status === Constants.NOTIFICATION.STATUS.CHUA_DOC) {
      updateMutation.mutate({
        items: [
          {
            id: dataItem.notificationId,
            status: Constants.NOTIFICATION.STATUS.DA_DOC,
          },
        ],
      });
    }
  };

  const onClickDeleteBtn = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    onOpenDeleteModal?.(dataItem.notificationId);
  };
  const listFile = last(jsonData?.attachments) as any;
  const isRead = dataItem.status === Constants.NOTIFICATION.STATUS.DA_DOC;
  const fileName = listFile?.file_name_original || listFile?.file_namel;

  // const fileName = dataItem?.
  return (
    <Row
      gutter={10}
      wrap={false}
      style={{
        width: "100%",
      }}
      align={isDetails ? "top" : "middle"}
      className={`notificationItemWrapper ${isDetails ? "detail" : ""} ${
        isRead ? "" : "active"
      }`}
      onClick={onClickNotification}
    >
      {/* Icon trạng thái đọc/chưa đọc */}
      <Col style={{ display: "flex", alignItems: "center" }}>
        <span
          style={{
            display: "inline-block",
            width: 10,
            height: 10,
            borderRadius: "50%",
            backgroundColor: isRead ? "#d9d9d9" : "#1890ff",
            opacity: isRead ? 0 : 1,
            // xám khi đã đọc, xanh khi chưa đọc
            marginTop: 10,
          }}
        />
      </Col>

      <Col flex="auto">
        <Row align="middle" justify="space-between" gutter={16}>
          <Col flex="14">
            <Typography.Paragraph className="notificationTitle nm-typo">
              {!isMessNoti
                ? !isEmpty(dataItem?.name)
                  ? dataItem?.name
                  : fileName
                : `Tin nhắn mới từ công việc "${jsonData?.projectName}"`}
            </Typography.Paragraph>
          </Col>
          {isDetails && (
            <Col flex="2">
              <Button
                className="btnAction"
                onClick={onClickDeleteBtn}
                icon={<DeleteOutlined />}
              />
            </Col>
          )}
        </Row>

        {isDetails ? (
          <Typography.Paragraph style={{ marginBottom: 4 }}>
            {!isMessNoti ? (
              <div
                className="notificationDesc"
                dangerouslySetInnerHTML={{
                  __html: dataItem.description
                    // .replaceAll(":", ": ")
                    .replace(/:(?!\/)/g, ": ")
                    .replaceAll(",", ", ")
                    .replace("<p>&nbsp;</p>", ""),
                }}
              />
            ) : (
              `${jsonData?.sender?.name}: ${jsonData?.content}`
            )}
          </Typography.Paragraph>
        ) : (
          <Typography.Paragraph style={{ marginBottom: 4 }}>
            {!isMessNoti ? (
              <div
                className="notificationNormalize"
                dangerouslySetInnerHTML={{ __html: normalizeDesc }}
              />
            ) : (
              `${jsonData?.sender?.name}: ${
                !isEmpty(jsonData?.content)
                  ? jsonData?.content
                  : !isEmpty(fileName)
                  ? fileName
                  : ""
              }`
            )}
          </Typography.Paragraph>
        )}

        <Typography.Paragraph type="secondary" style={{ marginBottom: 0 }}>
          {displayTime}
        </Typography.Paragraph>
      </Col>
    </Row>
  );
}
