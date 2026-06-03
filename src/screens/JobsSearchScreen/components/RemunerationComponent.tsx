import React, { useCallback, useMemo, useState, useEffect } from "react";
import { Radio, Space, Typography, InputNumber } from "antd";
import { JobSearchFilterParams } from "../JobsSearchScreenV2";


type RemunerationSectionV2Props = {
  filters: Partial<JobSearchFilterParams>;
  setFilters: React.Dispatch<React.SetStateAction<JobSearchFilterParams>>;
  setDefaultJobAndPartnerPageWhenFilter: () => void;
  dotColor: string;
};

const RemunerationSection = ({
  filters,
  setFilters,
  setDefaultJobAndPartnerPageWhenFilter,
  dotColor,
}: RemunerationSectionV2Props) => {
  const [localPriceMin, setLocalPriceMin] = useState<number | null | undefined>(
    filters.priceMin
  );
  const [localPriceMax, setLocalPriceMax] = useState<number | null | undefined>(
    filters.priceMax
  );
  const [isCustomPriceInvalid, setIsCustomPriceInvalid] = useState(false);

  useEffect(() => {
    setLocalPriceMin(filters.priceMin);
    setLocalPriceMax(filters.priceMax);
  }, [filters.priceMin, filters.priceMax]);

  const handlePriceRangeChange = useCallback(
    (e: any) => {
      setDefaultJobAndPartnerPageWhenFilter();
      const value = e.target.value;

      if (value === "custom") {
        handleCustomPriceChange(localPriceMin, localPriceMax);
        return;
      }

      setFilters((prev) => {
        let newPriceMin = undefined;
        let newPriceMax = undefined;

        switch (value) {
          case "less-than-1m":
            newPriceMax = 1000000;
            break;
          case "1m-to-5m":
            newPriceMin = 1000000;
            newPriceMax = 5000000;
            break;
          case "5m-to-10m":
            newPriceMin = 5000000;
            newPriceMax = 10000000;
            break;
          case "10m-to-20m":
            newPriceMin = 10000000;
            newPriceMax = 20000000;
            break;
          case "more-than-20m":
            newPriceMin = 20000000;
            break;
          default:
            break;
        }

        // Reset custom input values when switching to a preset range
        setLocalPriceMin(newPriceMin);
        setLocalPriceMax(newPriceMax);
        setIsCustomPriceInvalid(false);

        return {
          ...prev,
          priceMin: newPriceMin,
          priceMax: newPriceMax,
        };
      });
    },
    [
      setFilters,
      setDefaultJobAndPartnerPageWhenFilter,
      localPriceMin,
      localPriceMax,
    ]
  );

  const handleCustomPriceChange = useCallback(
    (min: number | null | undefined, max: number | null | undefined) => {
      setLocalPriceMin(min);
      setLocalPriceMax(max);

      const minVal = min || 0;
      const maxVal = max || 0;
      const isValid =
        min === null ||
        min === undefined ||
        max === null ||
        max === undefined ||
        minVal <= maxVal;
      setIsCustomPriceInvalid(!isValid);

      if (isValid) {
        setDefaultJobAndPartnerPageWhenFilter();
        setFilters((prev) => ({
          ...prev,
          priceMin: min === null ? undefined : min,
          priceMax: max === null ? undefined : max,
        }));
      }
    },
    [setFilters, setDefaultJobAndPartnerPageWhenFilter]
  );

  const getSelectedPriceRange = useMemo(() => {
    const { priceMin, priceMax } = filters;
    if (priceMax === 1000000 && priceMin === undefined) return "less-than-1m";
    if (priceMin === 1000000 && priceMax === 5000000) return "1m-to-5m";
    if (priceMin === 5000000 && priceMax === 10000000) return "5m-to-10m";
    if (priceMin === 10000000 && priceMax === 20000000) return "10m-to-20m";
    if (priceMin === 20000000 && priceMax === undefined) return "more-than-20m";

    if (
      (priceMin !== undefined && priceMin !== null) ||
      (priceMax !== undefined && priceMax !== null)
    ) {
      return "custom";
    }

    return undefined;
  }, [filters.priceMin, filters.priceMax]);

  const customRangeValue = getSelectedPriceRange === "custom";

  return (
    <div style={{ marginTop: 12 }}>
      <Typography.Title level={5} style={{ margin: 0, lineHeight: 1, flex: 1 }}>
        Ngân sách{" "}
        <span
          style={{
            display: "inline-block",
            width: 7,
            height: 7,
            borderRadius: "50%",
            marginLeft: 3,
            background: dotColor,
          }}
        />
      </Typography.Title>
      <Radio.Group
        onChange={handlePriceRangeChange}
        value={getSelectedPriceRange}
        style={{ width: "100%", marginTop: 8 }}
      >
        <Space direction="vertical" style={{ width: "100%" }}>
          <Radio value="less-than-1m">Nhỏ hơn 1 triệu</Radio>
          <Radio value="1m-to-5m">Từ 1 triệu đến 5 triệu</Radio>
          <Radio value="5m-to-10m">Từ 5 triệu đến 10 triệu</Radio>
          <Radio value="10m-to-20m">Từ 10 triệu đến 20 triệu</Radio>
          <Radio value="more-than-20m">Từ 20 triệu trở lên</Radio>
          <Radio value="custom">
            <Space direction="vertical" style={{ width: "100%" }}>
              <Space>
                <InputNumber
                  min={0}
                  style={{ width: 100 }}
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(value) => {
                    const parsedValue = value!.replace(/\$\s?|(,*)/g, "");
                    return parsedValue ? Number(parsedValue) : 0.0;
                  }}
                  placeholder="Tối thiểu"
                  value={localPriceMin}
                  onChange={(value) =>
                    handleCustomPriceChange(value, localPriceMax)
                  }
                  onClick={(e) => e.stopPropagation()}
                  status={isCustomPriceInvalid ? "error" : undefined}
                />
                -
                <InputNumber
                  min={0}
                  style={{ width: 100 }}
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(value) => {
                    const parsedValue = value!.replace(/\$\s?|(,*)/g, "");
                    return parsedValue ? Number(parsedValue) : 0.0;
                  }}
                  placeholder="Tối đa"
                  value={localPriceMax}
                  onChange={(value) =>
                    handleCustomPriceChange(localPriceMin, value)
                  }
                  onClick={(e) => e.stopPropagation()}
                  status={isCustomPriceInvalid ? "error" : undefined}
                />
              </Space>
              {isCustomPriceInvalid && (
                <Typography.Text type="danger" style={{ fontSize: 12 }}>
                  Giá tối thiểu không thể lớn hơn giá tối đa
                </Typography.Text>
              )}
            </Space>
          </Radio>
        </Space>
      </Radio.Group>
    </div>
  );
};

export default RemunerationSection;
