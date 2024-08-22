export default function NumberFormaterFunc(number) {
  const formatter = new Intl.NumberFormat('vi-VN'); // Đổi ngôn ngữ tùy thuộc vào yêu cầu của bạn ('en-US', 'vi-VN', vv.)
  return formatter.format(number);
}
