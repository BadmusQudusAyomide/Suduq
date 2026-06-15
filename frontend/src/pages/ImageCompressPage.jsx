import ImageToolPage from '../components/ImageToolPage';

export default function ImageCompressPage() {
  return (
    <ImageToolPage
      title="Image Compress"
      description="Reduce file size while keeping the result clean enough for sharing and web use."
      endpoint="/api/images/compress"
      actionLabel="Compress image"
      fields={[
        {
          name: 'quality',
          label: 'Quality',
          type: 'range',
          min: 30,
          max: 95,
          step: 1,
          defaultValue: 80
        },
        {
          name: 'format',
          label: 'Output format',
          type: 'select',
          defaultValue: 'webp',
          options: [
            { value: 'webp', label: 'WEBP' },
            { value: 'jpeg', label: 'JPG' },
            { value: 'png', label: 'PNG' }
          ]
        }
      ]}
      onBuildFields={(values) => ({
        quality: values.quality,
        format: values.format
      })}
    />
  );
}
