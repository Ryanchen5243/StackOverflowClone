export default function CompiledText({ text, className }) {
  const regex = /\[(.+?)\]\(((http:\/\/|https:\/\/).+?)\)/g;
  const replacedText = text.replace(regex, '<a target="_blank" href="$2">$1</a>');
  return <div style={{overflow:"auto"}} className={className} dangerouslySetInnerHTML={{ __html: replacedText }}/>;
}