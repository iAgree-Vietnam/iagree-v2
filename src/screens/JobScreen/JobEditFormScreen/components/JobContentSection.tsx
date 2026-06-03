
import dynamic from "next/dynamic";
import { Form } from "antd";
import { FormInstance } from "antd/lib/form/Form";

const TextEditor = dynamic(
  () => import("@/src/screens/EditorScreen/TextEditor"),
  { ssr: false }
);

interface JobContentSectionProps {
  form: FormInstance;
}

function JobContentSection(props: JobContentSectionProps) {
  const { form } = props;

  return (
    <div className={"formGroupContainer"}>
      <div className={"formGroupTitleContainer"}>
        <h3 className={"formGroupTitle"}>Nội dung công việc</h3>
      </div>

      <div className={"formGroupContentContainer"}>
        <div className={"jobEditorContainer"}>
          <Form.Item
            name={"description"}
            label={"Mô tả công việc"}
            required
            rules={[
              () => ({
                validator(_, value) {
                  if (value && value !== "<p>&nbsp;</p>")
                    return Promise.resolve();

                  return Promise.reject(
                    new Error("Vui lòng nhập mô tả cho công việc")
                  );
                },
              }),
            ]}
            valuePropName={"data"}
          >
            <TextEditor
              onChange={(value: string) => form.setFieldValue("description", value)}
            />
          </Form.Item>
        </div>
      </div>
    </div>
  );
}

export default JobContentSection;