export default function FetchError({ error }) {
  return <div>Error: {error?.message || "An unexpected error occurred"}</div>;
}
