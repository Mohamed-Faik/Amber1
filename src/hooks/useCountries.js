// Marrakech neighborhoods
const marrakechNeighborhoods = [
	{ value: "allal-el-fassi", label: "Allal el Fassi Marrakech", flag: "🇲🇦", latlng: [31.6295, -7.9811], region: "Marrakech" },
	{ value: "gueliz", label: "Gueliz Marrakech", flag: "🇲🇦", latlng: [31.6300, -7.9900], region: "Marrakech" },
	{ value: "hivernage", label: "Hivernage Marrakech", flag: "🇲🇦", latlng: [31.6250, -7.9850], region: "Marrakech" },
	{ value: "agdal", label: "Agdal Marrakech", flag: "🇲🇦", latlng: [31.6350, -7.9750], region: "Marrakech" },
	{ value: "palmeraie", label: "Palmeraie Marrakech", flag: "🇲🇦", latlng: [31.6500, -7.9700], region: "Marrakech" },
	{ value: "menara", label: "Menara Marrakech", flag: "🇲🇦", latlng: [31.6200, -7.9950], region: "Marrakech" },
	{ value: "sidi-youssef-ben-ali", label: "Sidi Youssef Ben Ali Marrakech", flag: "🇲🇦", latlng: [31.6150, -8.0000], region: "Marrakech" },
	{ value: "hay-riad", label: "Hay Riad Marrakech", flag: "🇲🇦", latlng: [31.6400, -7.9800], region: "Marrakech" },
	{ value: "daoudiate", label: "Daoudiate Marrakech", flag: "🇲🇦", latlng: [31.6250, -7.9750], region: "Marrakech" },
	{ value: "semlalia", label: "Semlalia Marrakech", flag: "🇲🇦", latlng: [31.6300, -7.9750], region: "Marrakech" },
	{ value: "targa", label: "Targa Marrakech", flag: "🇲🇦", latlng: [31.6350, -7.9800], region: "Marrakech" },
	{ value: "assif", label: "Assif Marrakech", flag: "🇲🇦", latlng: [31.6200, -7.9900], region: "Marrakech" },
	{ value: "hay-annahda", label: "Hay Annahda Marrakech", flag: "🇲🇦", latlng: [31.6150, -7.9850], region: "Marrakech" },
	{ value: "hay-al-massira", label: "Hay Al Massira Marrakech", flag: "🇲🇦", latlng: [31.6400, -7.9900], region: "Marrakech" },
	{ value: "hay-al-qods", label: "Hay Al Qods Marrakech", flag: "🇲🇦", latlng: [31.6250, -8.0050], region: "Marrakech" },
	{ value: "hay-al-farah", label: "Hay Al Farah Marrakech", flag: "🇲🇦", latlng: [31.6300, -8.0000], region: "Marrakech" },
	{ value: "hay-al-amal", label: "Hay Al Amal Marrakech", flag: "🇲🇦", latlng: [31.6200, -7.9800], region: "Marrakech" },
	{ value: "hay-al-firdaous", label: "Hay Al Firdaous Marrakech", flag: "🇲🇦", latlng: [31.6350, -7.9900], region: "Marrakech" },
	{ value: "hay-al-wahda", label: "Hay Al Wahda Marrakech", flag: "🇲🇦", latlng: [31.6150, -7.9750], region: "Marrakech" },
	{ value: "hay-al-karam", label: "Hay Al Karam Marrakech", flag: "🇲🇦", latlng: [31.6400, -7.9950], region: "Marrakech" },
	{ value: "hay-al-fath", label: "Hay Al Fath Marrakech", flag: "🇲🇦", latlng: [31.6250, -8.0000], region: "Marrakech" },
	{ value: "hay-al-mansour", label: "Hay Al Mansour Marrakech", flag: "🇲🇦", latlng: [31.6300, -7.9700], region: "Marrakech" },
	{ value: "hay-al-ittihad", label: "Hay Al Ittihad Marrakech", flag: "🇲🇦", latlng: [31.6350, -7.9850], region: "Marrakech" },
	{ value: "hay-al-falah", label: "Hay Al Falah Marrakech", flag: "🇲🇦", latlng: [31.6200, -7.9950], region: "Marrakech" },
	{ value: "hay-al-salam", label: "Hay Al Salam Marrakech", flag: "🇲🇦", latlng: [31.6400, -8.0000], region: "Marrakech" },
	{ value: "hay-al-badr", label: "Hay Al Badr Marrakech", flag: "🇲🇦", latlng: [31.6150, -7.9900], region: "Marrakech" },
];

const useCountries = () => {
	const getAll = () => marrakechNeighborhoods;

	const getByValue = (value) => {
		return marrakechNeighborhoods.find((item) => item.value === value);
	};

	return {
		getAll,
		getByValue,
	};
};

export default useCountries;
