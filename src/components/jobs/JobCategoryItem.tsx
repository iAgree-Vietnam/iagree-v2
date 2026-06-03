
import { Card, Image } from "antd";
import { useRouter } from "next/router";
import JobRouteUtils from "@/src/data/job/utils/JobRouteUtils";
import { CategoryResource } from "@/src/data/category/models/category.types";
import Images from "@/src/constants/Images";
import { useDetectDeviceV2 } from "@/src/hooks/useDetectDevice";

type JobCategoryItemProps = {
  data: CategoryResource;
  onChange?: (categoryName: string) => void | null;
};

function JobCategoryItem(props: JobCategoryItemProps) {
  const router = useRouter();
  const categoryResource = props.data;
  // const isMobile = useDetectDevice().isMobile();
  const { isMobile } = useDetectDeviceV2();

  return (
    <Card
      hoverable
      style={
        {
          // width: "100%",
          // display:"flex",
          // justifyContent:"center",
          // alignItems:"center"
        }
      }
      className={"categoryCard"}
      onClick={() => {
        if (props.onChange) {
          props.onChange(categoryResource.name);
        } else {
          router.push(
            JobRouteUtils.toJobsSearchScreen({
              categoryIds: [categoryResource.categoryId],
            })
          );
        }
      }}
    >
      <div
        style={{
          // ...(isMobile ? { width: "fit-content" } : {}),
          marginBottom: isMobile ? 8 : 0,
        }}
        className={"categoryIcon"}
      >
        <Image
          width={isMobile ? 32 : 40}
          height={isMobile ? 32 : 40}
          preview={false}
          src={categoryResource.photo}
          alt={categoryResource.name}
          fallback={Images.CATEGORY_ICON}
        />
      </div>
      <div
        // style={{
        //   textAlign: "center",
        // }}
        className={"categoryName"}
      >
        {categoryResource.name}
      </div>
    </Card>
  );
}

export default JobCategoryItem;
