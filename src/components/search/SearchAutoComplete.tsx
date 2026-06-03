import React, { useMemo, useState, useEffect, useCallback } from "react";
import { AutoComplete, Button, Dropdown, Input, Space, Typography } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";

import { IconSvgLocal } from "@/src/components/icon-svg-local";
import SearchRouteUtils from "@/src/data/search/utils/SearchRouteUtils";
import { useBreakpoint } from "@/src/hooks/useBreakpoint";
import useHomeSuggestion from "@/src/screens/HomeScreen/hooks/useHomeSuggestion";
// 🛑 ĐÃ XÓA: import { debounce, template } from "lodash";
import useDetectDevice from "@/src/hooks/useDetectDevice";
// 🛑 ĐÃ XÓA: import { template } from "lodash";

interface SearchAutoCompleteProps {
  placeholder?: string;
  initialSearchTerm?: string;
  initialSelectedKey?: string | null;
  onSearchSubmit?: (searchTerm: string, selectedKey: string | null) => void;
  width?: string | number;
}

const dropdownMenuItems = [
  { label: "Công việc", key: "job" },
  { label: "Đối tác", key: "partner" },
  // { label: "Biểu mẫu", key: "template" },
];

export default function SearchAutoComplete({
  placeholder = "Lập trình, thiết kế, pháp lý, ...",
  initialSearchTerm = "",
  initialSelectedKey = "job",
  onSearchSubmit,
  width = "90%",
}: SearchAutoCompleteProps) {
  const { isDesktop } = useBreakpoint();
  const router = useRouter();
  const [search, setSearch] = useState<string>(initialSearchTerm);
  const [openDropdown, setOpenDropdown] = useState(false);
  
  // 🛑 LOẠI BỎ: highlightedIndex không cần thiết nếu không cần điều khiển arrow key phức tạp
  // const [highlightedIndex, setHighlightedIndex] = useState<number>(-1); 
  
  const [highlightedValue, setHighlightedValue] = useState<string | null>(null);
  const [selectedKey, setSelectedKey] = useState<string | null>(
    initialSelectedKey
  );
  const mobile = useDetectDevice().isMobile();

  const suggestSearch = useHomeSuggestion(search, selectedKey);

  const goSearch = useCallback(
    (searchTerm: string) => {
      const trimmed = searchTerm.trim();
      if (!trimmed || trimmed === "no-results") return; // Thêm check "no-results" an toàn

      if (onSearchSubmit) {
        onSearchSubmit(trimmed, selectedKey);
      } else {
        // ... (Logic routing giữ nguyên)
        if (selectedKey === "template") {
          router
            .push({
              pathname: "/templates/list",
              query: { search: trimmed },
            })
            .then(() => null);
        } else {
          const queryParams = {
            search: trimmed,
            type: selectedKey || "job",
          };
          router.push(SearchRouteUtils.toScreen(queryParams)).then(() => null);
        }
      }
    },
    [onSearchSubmit, selectedKey, router]
  );

  // 🟢 TỐI ƯU USEMEMO: Tạo options
  const options = useMemo(() => {
    if (!suggestSearch.data) return [];
    const { jobs, partners, templates } = suggestSearch.data;

    const finalOptions: any[] = [];
    const uniqueItems = new Map();

    const addUniqueItems = (items: any[] | undefined) => {
      if (items) {
        items.forEach((item) => {
          if (item.name && !uniqueItems.has(item.name)) {
            uniqueItems.set(item.name, { value: item.name, label: item.name });
          }
        });
      }
    };

    if (selectedKey === "job") addUniqueItems(jobs);
    if (selectedKey === "partner") addUniqueItems(partners);
    if (selectedKey === "template") addUniqueItems(templates);

    const finalOptionsArray = Array.from(uniqueItems.values());

    if (finalOptionsArray.length === 0 && search && search.trim() !== "") {
      return [
        {
          value: "no-results",
          label: (
            <div style={{ textAlign: "center", color: "#999" }}>
              Không có kết quả khớp với tìm kiếm của bạn
            </div>
          ),
          disabled: true,
        },
      ];
    }
    return finalOptionsArray;
  }, [suggestSearch.data, search, selectedKey]);

  // 🛑 FLAT OPTIONS KHÔNG CẦN THIẾT NẾU CHÚNG TA KHÔNG DÙNG HIGHLIGHTEDINDEX
  // Vì options đã là mảng các object {value, label} đơn giản
  const flatOptions = options; 

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // 🛑 ĐÃ XÓA LOGIC ARROW KEY PHỨC TẠP
    
    if (e.key === "Enter") {
      e.preventDefault();
      // Sử dụng giá trị highlight (nếu người dùng đã chọn từ dropdown) hoặc giá trị hiện tại
      const searchTerm = highlightedValue || search;
      goSearch(searchTerm);
      setOpenDropdown(false);
    } else if (e.key === "Escape") {
      setOpenDropdown(false);
      // setHighlightedIndex(-1); // Không cần thiết
      setHighlightedValue(null);
    }
  };

  const handleSelect = (value: string) => {
    setSearch(value);
    setHighlightedValue(null);
    setOpenDropdown(false);
    goSearch(value);
  };

  // 🟢 HÀM XỬ LÝ SEARCH ĐỒNG BỘ MỚI (FIX CHO LỖI IME)
  // Loại bỏ hoàn toàn debounce
  const handleSearchChange = (value: string) => {
    setSearch(value);
    setHighlightedValue(null);
    // setHighlightedIndex(-1); // Không cần thiết
    setOpenDropdown(!!value && value.trim() !== "");
  };

  // 🛑 ĐÃ XÓA LOGIC DEBOUNCE VÀ USEEFFECT CLEANUP LIÊN QUAN

  const handleSearchClick = () => {
    const searchTerm = highlightedValue || search;
    setOpenDropdown(false);
    goSearch(searchTerm);
  };

  const handleMenuClick = ({ key }: { key: string }) => {
    setSelectedKey(key);
  };

  const selectedLabel =
    dropdownMenuItems.find((item) => item.key === selectedKey)?.label ||
    "Công việc";

  return (
    <AutoComplete
      open={openDropdown}
      options={options as any}
      onSelect={handleSelect}
      onSearch={handleSearchChange} // 🟢 Dùng hàm đồng bộ mới
      onBlur={() => {
        setOpenDropdown(false);
        setHighlightedValue(null);
      }}
      // 🟢 Giá trị được điều khiển bởi state search/highlightedValue
      value={highlightedValue || search} 
      style={{ width: width, borderRadius: "40px" }}
      size={"middle"}
      styles={{
        popup: {
          root: {
            borderRadius: "6px",
          },
        },
      }}
    >
      <Input
        size={"middle"}
        placeholder={placeholder}
        style={{
          ...(mobile
            ? {
                paddingLeft: "8px",
              }
            : {}),
          width: "100%",
          borderRadius: "40px",
        }}
        onKeyDown={handleKeyDown}
        // 🛑 BỎ onChange, để AutoComplete xử lý thông qua onSearch (đã gọi handleSearchChange)
        suffix={
          <Button
            type={"primary"}
            size={"middle"}
            onClick={handleSearchClick}
            className={"btnSearch"}
          >
            <IconSvgLocal
              name={"IC_SEARCH"}
              width={20}
              height={20}
              fill={"#FFFFFF"}
            />
          </Button>
        }
        prefix={
          <Dropdown
            trigger={["click"]}
            menu={{
              items: dropdownMenuItems,
              selectedKeys: selectedKey ? [selectedKey] : ["job"],
              onClick: handleMenuClick,
            }}
          >
            <Space
              style={{
                padding: "8px 12px",
                paddingLeft: "16px",
                cursor: "pointer",
                justifyContent: "space-between",
                backgroundColor: "#E6F5EC",
                borderRadius: "50px",
              }}
            >
              <Typography.Paragraph
                ellipsis={{ rows: 1 }}
                className={"nm-typo"}
                style={{ width: !isDesktop ? "50px" : "80px" }}
              >
                {selectedLabel}
              </Typography.Paragraph>
              <DownOutlined style={{ fontSize: "12px" }} />
            </Space>
          </Dropdown>
        }
      />
    </AutoComplete>
  );
}