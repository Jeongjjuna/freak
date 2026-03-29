interface Props {
  html: string;
}

export default function PostContent({html}: Props) {
  return (
    <div
      className="prose"
      dangerouslySetInnerHTML={{__html: html}}
    />
  );
}
