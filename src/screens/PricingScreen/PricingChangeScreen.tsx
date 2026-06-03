import React, { useMemo, useState } from "react";
import { Table, Select, DatePicker, Card, Row, Col, Button, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import RootLayout from "@/src/layouts/RootLayout";
import Head from "next/head";
import Link from "next/link";
import useSWR from "swr";
import {
  ChanceBalance,
  ChanceService,
  OpportunityTxnType,
} from "@/src/data/chance/chance.service";
import { OpportunityTxnLabels } from "./constant";
import { ProfileContainer } from "@/src/components/ProfileContainer";

const { Option } = Select;
const { RangePicker } = DatePicker;

interface OpportunityRow {
  key: number;
  date: string;
  type: string;
  amount: number;
}

function PricingChangeScreen() {
  const [selectedType, setSelectedType] = useState<OpportunityTxnType>(
    OpportunityTxnType.ALL
  );

  const [range, setRange] = useState<[Dayjs | null, Dayjs | null]>([
    dayjs().startOf("month"),
    dayjs().endOf("month"),
  ]);

  const { data: dataBalance } = useSWR<ChanceBalance>(
    ["chance-balance"],
    () => new ChanceService().getChanceBalance({}),
    {
      revalidateOnFocus: true,
      dedupingInterval: 15 * 60 * 1000,
    }
  );

  

  const historyParams = {
    ...(selectedType !== OpportunityTxnType.ALL ? { type: selectedType } : {}),
    ...(range?.[0] ? { start_date: range[0]!.format("YYYY-MM-DD") } : {}),
    ...(range?.[1] ? { end_date: range[1]!.format("YYYY-MM-DD") } : {}),
      per_page: 20,
  };

  const { data: historyResp, isLoading: loadingHistory } = useSWR(
    ["chance-history", historyParams],
    () => new ChanceService().opportunityHistory(historyParams),
    { revalidateOnFocus: true }
  );

  const transactions: OpportunityRow[] = useMemo(() => {
    const list = historyResp?.transactions ?? [];
    return list.map((m: any, idx: number) => ({
      key: idx + 1,
      date: m.created_at ? dayjs(m.created_at).format("DD-MM-YYYY") : "",
      type: m.type,
      amount: m.amount ?? 0,
    }));
  }, [historyResp?.transactions]);

  const columns: ColumnsType<OpportunityRow> = [
    { title: "Ngày", dataIndex: "date", key: "date", width: 140 },
    {
      title: "Loại Cơ Hội",
      dataIndex: "type",
      key: "type",
      render: (type: string) => {
        const danger =
          type === OpportunityTxnType.EXPIRED ||
          type === OpportunityTxnType.JOB_BID;
        return (
          <Tag color={danger ? "red" : "green"}>
            {OpportunityTxnLabels?.[type as OpportunityTxnType] }
          </Tag>
        );
      },
    },
    {
      title: "Số Cơ Hội",
      dataIndex: "amount",
      key: "amount",
      // width: 140,
      align: "right",
      render: (amount: number) => (
        <span style={{ color: amount > 0 ? "#1677ff" : "#ff4d4f" }}>
          {amount > 0 ? `+${amount}` : amount}
        </span>
      ),
    },
  ];

  const handleTypeChange = (value: OpportunityTxnType) =>
    setSelectedType(value);
  const handleRangeChange = (values: null | [Dayjs | null, Dayjs | null]) => {
    setRange(values ?? [null, null]);
  };

  return (
    <RootLayout>
      <Head>
        <title>Quản lý Cơ Hội</title>
      </Head>
      <ProfileContainer>
        <h1 className={'pageHeaderTitle'}>Quản lý Cơ Hội</h1>
        <div className={'contentWrapper subscriptionContainer'}>

      <section className="pageHeaderWrapper">
        <div className="contentWrapper" style={{ marginBottom: 16 }}>
          <Card style={{ maxWidth: 500, width: "max-content" }}>
            <Row align="top" gutter={16}>
              <Col>
                <div style={{ fontSize: 16, fontWeight: 700 }}>
                  Cơ Hội của tôi
                </div>
                <div style={{ fontSize: 24, color: "#333" }}>
                  {dataBalance?.current_balance ?? 0}
                </div>
              </Col>
            </Row>
          </Card>

          <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
            <Link href="/pricing" passHref>
              <Button type="primary">Mua Cơ Hội</Button>
            </Link>

            <Select
              value={selectedType}
              style={{ width: 220 }}
              onChange={handleTypeChange}
            >
              {Object.entries(OpportunityTxnLabels).map(([key, label]) => (
                <Option key={key} value={key}>
                  {label}
                </Option>
              ))}
            </Select>

            <RangePicker
              value={range}
              onChange={handleRangeChange}
              allowClear
              format="DD/MM/YYYY"
              style={{ width: 320 }}
            />
          </div>
        </div>

        <div className="contentWrapper" style={{ marginBottom: 16 }}>
          <Table
            loading={loadingHistory}
            columns={columns}
            dataSource={transactions}
            rowKey="key"
            pagination={{
              pageSize: historyResp?.pagination?.per_page ?? 20,
              total: historyResp?.pagination?.total ?? 0,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} trong tổng ${total} giao dịch`,
            }}
          />
        </div>
      </section>
      </div>
      </ProfileContainer>
    </RootLayout>
  );
}

export default PricingChangeScreen;
