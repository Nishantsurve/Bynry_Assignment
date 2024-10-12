import { Create, useForm, useSelect } from "@refinedev/antd";
import MDEditor from "@uiw/react-md-editor";
import { Form, Input, Select } from "antd";

export const BlogPostCreate = () => {
  const { formProps, saveButtonProps } = useForm({});

  const { selectProps: categorySelectProps } = useSelect({
    resource: "categories",
  });

  return (
    <Create saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
        <Form.Item
          label={"Name"}
          name={["title"]}
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label={"Summary"}
          name="content"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label={"Location"}
          name={["category", "id"]}
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Select {...categorySelectProps} />
        </Form.Item>
        <Form.Item
          label={"Age"}
          name={["status"]}
          initialValue={"18-24"}
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Select
            defaultValue={"18-24"}
            options={[
              { value: "18-24", label: "18-24 years" },
              { value: "25-34", label: "25-34 years" },
              { value: "35-44", label: "35-44 years" },
            ]}
            style={{ width: 90 }}
          />
        </Form.Item>
      </Form>
    </Create>
  );
};
