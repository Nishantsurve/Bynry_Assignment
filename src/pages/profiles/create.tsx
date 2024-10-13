import { Create, useForm, useSelect } from "@refinedev/antd";
import MDEditor from "@uiw/react-md-editor";
import { Form, Input, Select ,Upload,Button} from "antd";
import { UploadOutlined } from '@ant-design/icons';
import { useCallback,useState } from "react";

export const BlogPostCreate = () => {
  const { formProps, saveButtonProps } = useForm({});
  const [imageUrl, setImageUrl] = useState<string>("");

  const { selectProps: categorySelectProps } = useSelect({
    resource: "categories",
  });

  const getCloudflareUploadUrl = async () => {
    const CLOUDFLARE_ACCOUNT_ID = 'b4f99c7355d50a28012381542d7f2561'; // Replace with your Cloudflare Account ID
    const CLOUDFLARE_API_TOKEN = 'IeBXvYfCi6z1Gw79zoftFDbbag46top-5zHnDWoM';   // Replace with your Cloudflare API Token

    const response = await fetch(`https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/images/v2/direct_upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${CLOUDFLARE_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    return data.result.uploadURL; // Return the direct upload URL
  };


  const handleUpload = useCallback(async (file: string | Blob) => {
    const uploadURL = await getCloudflareUploadUrl(); // Fetch Cloudflare upload URL

    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(uploadURL, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
    setImageUrl(data.result.variants[0]); // Assuming Cloudflare returns the image URL
    return data.result.variants[0]; // Return the uploaded image URL for further use
  }, []);


  return (
    <Create saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">


       <Form.Item
          label={"Upload Image"}
          name={["image"]}
          rules={[{ required: true }]}
        >
          <Upload
            beforeUpload={handleUpload}
            showUploadList={false} // Hides the list of uploaded files
          >
            <Button icon={<UploadOutlined />}>Upload Image</Button>
          </Upload>
        </Form.Item>

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
            defaultValue={"ND"}
            options={[
              { label: "young",  value: "18-25" },
              { label: "middle", value: "26-35" },
              { label: "senior", value: "36 and above" },
            ]}
            style={{ width: 90 }}
          />
        </Form.Item>
      </Form>
    </Create>
  );
};
