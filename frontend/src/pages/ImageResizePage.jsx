import ImageToolPage from '../components/ImageToolPage';

export default function ImageResizePage() {
  return (
    <ImageToolPage
      title="Image Resize"
      description="Set a target width and height, then let Sharp handle the export."
      endpoint="/api/images/resize"
      actionLabel="Resize image"
      fields={[
        {
          name: 'width',
          label: 'Width (px)',
          type: 'number',
          min: 1,
          defaultValue: 1200,
          placeholder: '1200'
        },
        {
          name: 'height',
          label: 'Height (px)',
          type: 'number',
          min: 1,
          defaultValue: 1200,
          placeholder: '1200'
        }
      ]}
      onBuildFields={(values) => ({
        width: values.width,
        height: values.height
      })}
    />
  );
}
