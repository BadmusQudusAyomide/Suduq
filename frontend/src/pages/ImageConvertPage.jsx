import ImageToolPage from '../components/ImageToolPage';

export default function ImageConvertPage() {
  return (
    <ImageToolPage
      title="Image Convert"
      description="Convert the uploaded image into PNG, JPG, or WEBP."
      endpoint="/api/images/convert"
      actionLabel="Convert image"
      fields={[
        {
          name: 'format',
          label: 'Target format',
          type: 'select',
          defaultValue: 'png',
          options: [
            { value: 'png', label: 'PNG' },
            { value: 'jpeg', label: 'JPG' },
            { value: 'webp', label: 'WEBP' }
          ]
        }
      ]}
      onBuildFields={(values) => ({
        format: values.format
      })}
    />
  );
}
