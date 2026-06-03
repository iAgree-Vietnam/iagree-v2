
import { FormInstance } from "antd/lib/form/Form";

import {
  CateServiceResource,
  ServiceResource,
} from "@/src/data/category/models/category.types";
import { SkillResource } from "@/src/data/skill/models/skill.types";
import { JobSelectboxResource } from "@/src/data/job/models/job.types";
import JobGeneralInfoSection from "./JobGeneralInfoSection";

interface JobOverviewStepsProps {
  form: FormInstance;
  selectboxResource: JobSelectboxResource;
  salaryType: number;
  setSalaryType: (type: number) => void;
  selectedCategoryIds: number[] | number | undefined;
  filteredSkills: SkillResource[];
  serviceCategoriesAvailable: CateServiceResource[] | null;
  selectedCategoryServiceIds: number[] | number | undefined;
  servicesAvailable: ServiceResource[] | null;
}

function JobOverviewStep(props: JobOverviewStepsProps) {
  return (
    <>
      <JobGeneralInfoSection
        form={props.form}
        selectboxResource={props.selectboxResource}
        salaryType={props.salaryType}
        setSalaryType={props.setSalaryType}
        selectedCategoryIds={props.selectedCategoryIds}
        filteredSkills={props.filteredSkills}
        serviceCategoriesAvailable={props.serviceCategoriesAvailable}
        selectedCategoryServiceIds={props.selectedCategoryServiceIds}
        servicesAvailable={props.servicesAvailable}
      />
    </>
  );
}

export default JobOverviewStep;
