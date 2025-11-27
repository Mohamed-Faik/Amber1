"use client";

import Select from "react-select";

// Marrakech neighborhoods
const marrakechNeighborhoods = [
	{ value: "bab doukkala marrakech", label: "Bab Doukkala, Marrakech" },
	{ value: "sidi mimoun marrakech", label: "Sidi Mimoun, Marrakech" },
	{ value: "kasbah marrakech", label: "Kasbah, Marrakech" },
	{ value: "el ksour marrakech", label: "El Ksour, Marrakech" },
	{ value: "berrima marrakech", label: "Berrima, Marrakech" },
	{ value: "riad zitoun jdid marrakech", label: "Riad Zitoun Jdid, Marrakech" },
	{ value: "riad zitoun lakdim marrakech", label: "Riad Zitoun Lakdim, Marrakech" },
	{ value: "riad laarous marrakech", label: "Riad Laarous, Marrakech" },
	{ value: "mouassine marrakech", label: "Mouassine, Marrakech" },
	{ value: "bab taghzout marrakech", label: "Bab Taghzout, Marrakech" },
	{ value: "bab kechich marrakech", label: "Bab Kechich, Marrakech" },
	{ value: "ben salah marrakech", label: "Ben Salah, Marrakech" },
	{ value: "derb dabachi marrakech", label: "Derb Dabachi, Marrakech" },
	{ value: "derb sidi bouamar marrakech", label: "Derb Sidi Bouamar, Marrakech" },
	{ value: "derb el maaza marrakech", label: "Derb el Maâza, Marrakech" },
	{ value: "derb el kadi marrakech", label: "Derb el Kadi, Marrakech" },
	{ value: "derb aghrab marrakech", label: "Derb Aghrab, Marrakech" },
	{ value: "derb el ferrane marrakech", label: "Derb el Ferrane, Marrakech" },
	{ value: "kennaria marrakech", label: "Kennaria, Marrakech" },
	{ value: "lakssour marrakech", label: "Lakssour, Marrakech" },
	{ value: "sidi abdellaziz marrakech", label: "Sidi Abdellaziz, Marrakech" },
	{ value: "souk semmarine marrakech", label: "Souk Semmarine, Marrakech" },
	{ value: "jemaa el fna marrakech", label: "Jemaa el Fna, Marrakech" },
	{ value: "mellah marrakech", label: "Mellah, Marrakech" },
	{ value: "hay essalam marrakech", label: "Hay Essalam, Marrakech" },
	{ value: "hay salam marrakech", label: "Hay Salam, Marrakech" },
	{ value: "hay el bahroura marrakech", label: "Hay El Bahroura, Marrakech" },
	{ value: "bab ahmar marrakech", label: "Bab Ahmar, Marrakech" },
	{ value: "bab aylan marrakech", label: "Bab Aylan, Marrakech" },
	{ value: "bab hmar marrakech", label: "Bab Hmar, Marrakech" },
	{ value: "bab khemis marrakech", label: "Bab Khemis, Marrakech" },
	{ value: "gueliz centre marrakech", label: "Guéliz Centre, Marrakech" },
	{ value: "camp el ghoul marrakech", label: "Camp El Ghoul, Marrakech" },
	{ value: "majorelle marrakech", label: "Majorelle, Marrakech" },
	{ value: "diour saboun marrakech", label: "Diour Saboun, Marrakech" },
	{ value: "semlalia marrakech", label: "Semlalia, Marrakech" },
	{ value: "rue de yougoslavie marrakech", label: "Rue de Yougoslavie, Marrakech" },
	{ value: "avenue abdelkarim khattabi marrakech", label: "Avenue Abdelkarim Khattabi, Marrakech" },
	{ value: "zerktouni marrakech", label: "Zerktouni, Marrakech" },
	{ value: "ibn tachfine marrakech", label: "Ibn Tachfine, Marrakech" },
	{ value: "afaq marrakech", label: "Afaq, Marrakech" },
	{ value: "arset aouzal extension marrakech", label: "Arset Aouzal Extension, Marrakech" },
	{ value: "daoudiate south marrakech", label: "Daoudiate South, Marrakech" },
	{ value: "douar laskar marrakech", label: "Douar Laskar, Marrakech" },
	{ value: "hay sakar marrakech", label: "Hay Sakar, Marrakech" },
	{ value: "massira khadra marrakech", label: "Massira Khadra, Marrakech" },
	{ value: "hivernage nord marrakech", label: "Hivernage Nord, Marrakech" },
	{ value: "hivernage sud marrakech", label: "Hivernage Sud, Marrakech" },
	{ value: "avenue mohamed vi zone marrakech", label: "Avenue Mohamed VI Zone, Marrakech" },
	{ value: "menara gardens zone marrakech", label: "Menara Gardens Zone, Marrakech" },
	{ value: "quartier du theatre royal marrakech", label: "Quartier du Théâtre Royal, Marrakech" },
	{ value: "agdal marrakech", label: "Agdal, Marrakech" },
	{ value: "aguedal gardens marrakech", label: "Aguedal Gardens, Marrakech" },
	{ value: "avenue de la menara marrakech", label: "Avenue de la Ménara, Marrakech" },
	{ value: "avenue hassan ii extension marrakech", label: "Avenue Hassan II Extension, Marrakech" },
	{ value: "el harti marrakech", label: "El Harti, Marrakech" },
	{ value: "mhamid shared zone marrakech", label: "Mhamid Shared Zone, Marrakech" },
	{ value: "massira i marrakech", label: "Massira I, Marrakech" },
	{ value: "massira ii marrakech", label: "Massira II, Marrakech" },
	{ value: "massira iii marrakech", label: "Massira III, Marrakech" },
	{ value: "hay oumnas marrakech", label: "Hay Oumnas, Marrakech" },
	{ value: "hay menara marrakech", label: "Hay Menara, Marrakech" },
	{ value: "sidi abbad marrakech", label: "Sidi Abbad, Marrakech" },
	{ value: "hay al farah marrakech", label: "Hay Al Farah, Marrakech" },
	{ value: "hay el hana marrakech", label: "Hay El Hana, Marrakech" },
	{ value: "syba centre marrakech", label: "SYBA Centre, Marrakech" },
	{ value: "el baraka marrakech", label: "El Baraka, Marrakech" },
	{ value: "riad zitoun syba marrakech", label: "Riad Zitoun SYBA, Marrakech" },
	{ value: "riad el atlas marrakech", label: "Riad El Atlas, Marrakech" },
	{ value: "sidi youssef el gharbi marrakech", label: "Sidi Youssef El Gharbi, Marrakech" },
	{ value: "sidi youssef el cherqi marrakech", label: "Sidi Youssef El Cherqi, Marrakech" },
	{ value: "douar el qods marrakech", label: "Douar El Qods, Marrakech" },
	{ value: "hay el inara marrakech", label: "Hay El Inara, Marrakech" },
	{ value: "hay mohammadi marrakech", label: "Hay Mohammadi, Marrakech" },
	{ value: "jnane awrad marrakech", label: "Jnane Awrad, Marrakech" },
	{ value: "arset tihiri marrakech", label: "Arset Tihiri, Marrakech" },
	{ value: "hay jnane houara marrakech", label: "Hay Jnane Houara, Marrakech" },
	{ value: "hay saada marrakech", label: "Hay Saada, Marrakech" },
	{ value: "hay el mhammedia marrakech", label: "Hay El Mhammedia, Marrakech" },
	{ value: "palmeraie 1 marrakech", label: "Palmeraie 1, Marrakech" },
	{ value: "palmeraie 2 marrakech", label: "Palmeraie 2, Marrakech" },
	{ value: "palmeraie 3 marrakech", label: "Palmeraie 3, Marrakech" },
	{ value: "dar tounsi marrakech", label: "Dar Tounsi, Marrakech" },
	{ value: "ennakhil nord marrakech", label: "Ennakhil Nord, Marrakech" },
	{ value: "ennakhil sud marrakech", label: "Ennakhil Sud, Marrakech" },
	{ value: "nabou marrakech", label: "Nabou, Marrakech" },
	{ value: "oulad hassoun marrakech", label: "Oulad Hassoun, Marrakech" },
	{ value: "ghabat chrifia marrakech", label: "Ghabat Chrifia, Marrakech" },
	{ value: "douar abiad marrakech", label: "Douar Abiad, Marrakech" },
	{ value: "douar ben rahmoune marrakech", label: "Douar Ben Rahmoune, Marrakech" },
	{ value: "bab atlas marrakech", label: "Bab Atlas, Marrakech" },
	{ value: "circuit de la palmeraie marrakech", label: "Circuit de la Palmeraie, Marrakech" },
	{ value: "douar lahna marrakech", label: "Douar Lahna, Marrakech" },
	{ value: "douar laarassi marrakech", label: "Douar Laarassi, Marrakech" },
	{ value: "ouled moumen marrakech", label: "Ouled Moumen, Marrakech" },
	{ value: "targa oulad azzouz marrakech", label: "Targa Oulad Azzouz, Marrakech" },
	{ value: "targa nakhil marrakech", label: "Targa Nakhil, Marrakech" },
	{ value: "targa lalla haya marrakech", label: "Targa Lalla Haya, Marrakech" },
	{ value: "targa wahat marrakech", label: "Targa Wahat, Marrakech" },
	{ value: "targa campagne marrakech", label: "Targa Campagne, Marrakech" },
	{ value: "hay al wifaq marrakech", label: "Hay Al Wifaq, Marrakech" },
	{ value: "hay riad targa marrakech", label: "Hay Riad Targa, Marrakech" },
	{ value: "yasmine targa marrakech", label: "Yasmine Targa, Marrakech" },
	{ value: "jawhara targa marrakech", label: "Jawhara Targa, Marrakech" },
	{ value: "manzah targa marrakech", label: "Manzah Targa, Marrakech" },
	{ value: "mhamid 1 marrakech", label: "Mhamid 1, Marrakech" },
	{ value: "mhamid 2 marrakech", label: "Mhamid 2, Marrakech" },
	{ value: "mhamid 3 marrakech", label: "Mhamid 3, Marrakech" },
	{ value: "mhamid 4 marrakech", label: "Mhamid 4, Marrakech" },
	{ value: "mhamid 5 marrakech", label: "Mhamid 5, Marrakech" },
	{ value: "mhamid 6 marrakech", label: "Mhamid 6, Marrakech" },
	{ value: "mhamid 7 marrakech", label: "Mhamid 7, Marrakech" },
	{ value: "mhamid 8 marrakech", label: "Mhamid 8, Marrakech" },
	{ value: "mhamid 9 marrakech", label: "Mhamid 9, Marrakech" },
	{ value: "hay nassim marrakech", label: "Hay Nassim, Marrakech" },
	{ value: "hay massira azli marrakech", label: "Hay Massira Azli, Marrakech" },
	{ value: "hay el bassatine marrakech", label: "Hay El Bassatine, Marrakech" },
	{ value: "hay el fath marrakech", label: "Hay El Fath, Marrakech" },
	{ value: "hay el moustakbal marrakech", label: "Hay El Moustakbal, Marrakech" },
	{ value: "daoudiate marrakech", label: "Daoudiate, Marrakech" },
	{ value: "daoudiate est marrakech", label: "Daoudiate Est, Marrakech" },
	{ value: "daoudiate ouest marrakech", label: "Daoudiate Ouest, Marrakech" },
	{ value: "hay el mhamid extension marrakech", label: "Hay El Mhamid Extension, Marrakech" },
	{ value: "sidi ghanem industriel marrakech", label: "Sidi Ghanem Industriel, Marrakech" },
	{ value: "jnane al atiq marrakech", label: "Jnane Al Atiq, Marrakech" },
	{ value: "lotissement mabrouka marrakech", label: "Lotissement Mabrouka, Marrakech" },
	{ value: "mawarid marrakech", label: "Mawarid, Marrakech" },
	{ value: "hay el addarissa marrakech", label: "Hay El Addarissa, Marrakech" },
	{ value: "hay el ousra marrakech", label: "Hay El Ousra, Marrakech" },
	{ value: "hay el rahma marrakech", label: "Hay El Rahma, Marrakech" },
	{ value: "massira 1 marrakech", label: "Massira 1, Marrakech" },
	{ value: "massira 2 marrakech", label: "Massira 2, Marrakech" },
	{ value: "massira 3 marrakech", label: "Massira 3, Marrakech" },
	{ value: "massira 4 marrakech", label: "Massira 4, Marrakech" },
	{ value: "hay azli marrakech", label: "Hay Azli, Marrakech" },
	{ value: "hay al hassania marrakech", label: "Hay Al Hassania, Marrakech" },
	{ value: "hay al amal marrakech", label: "Hay Al Amal, Marrakech" },
	{ value: "hay al jadid marrakech", label: "Hay Al Jadid, Marrakech" },
	{ value: "hay chrifia marrakech", label: "Hay Chrifia, Marrakech" },
	{ value: "hay dabachi extension marrakech", label: "Hay Dabachi Extension, Marrakech" },
	{ value: "sidi ghanem centre marrakech", label: "Sidi Ghanem Centre, Marrakech" },
	{ value: "sidi ghanem nord marrakech", label: "Sidi Ghanem Nord, Marrakech" },
	{ value: "sidi ghanem sud marrakech", label: "Sidi Ghanem Sud, Marrakech" },
	{ value: "zone industrielle 1 marrakech", label: "Zone Industrielle 1, Marrakech" },
	{ value: "zone industrielle 2 marrakech", label: "Zone Industrielle 2, Marrakech" },
	{ value: "magasin ar zone marrakech", label: "Magasin AR Zone, Marrakech" },
	{ value: "diour sidi ghanem lotissements marrakech", label: "Diour Sidi Ghanem Lotissements, Marrakech" },
	{ value: "tamansourt marrakech", label: "Tamansourt, Marrakech" },
	{ value: "chwiter marrakech", label: "Chwiter, Marrakech" },
	{ value: "tassoultante marrakech", label: "Tassoultante, Marrakech" },
	{ value: "ait ourir road zone marrakech", label: "Ait Ourir Road Zone, Marrakech" },
	{ value: "douar sidi moussa marrakech", label: "Douar Sidi Moussa, Marrakech" },
	{ value: "ouled dlim marrakech", label: "Ouled Dlim, Marrakech" },
	{ value: "el atabi marrakech", label: "El Atabi, Marrakech" },
	{ value: "el warda marrakech", label: "El Warda, Marrakech" },
	{ value: "el ouidane marrakech", label: "El Ouidane, Marrakech" },
	{ value: "oulad merzoug marrakech", label: "Oulad Merzoug, Marrakech" },
	{ value: "issil marrakech", label: "Issil, Marrakech" },
	{ value: "complexe issil area marrakech", label: "Complexe Issil Area, Marrakech" },
	{ value: "jnane issil marrakech", label: "Jnane Issil, Marrakech" },
	{ value: "residence issil extension marrakech", label: "Résidence Issil Extension, Marrakech" },
];

const CitySelectValue = {
	label: "",
	value: "",
	latlng: [31.6295, -7.9811], // Default Marrakech coordinates
};

const CitySelect = ({ value, onChange }) => {
	return (
		<div className="form-group">
			<Select
				placeholder="Select neighborhood in Marrakech"
				isClearable
				isSearchable
				options={marrakechNeighborhoods}
				value={value}
				onChange={(selectedValue) => {
					if (selectedValue) {
						onChange({
							...selectedValue,
							latlng: [31.6295, -7.9811], // Marrakech coordinates
							region: "Marrakech",
						});
					} else {
						onChange(null);
					}
				}}
				formatOptionLabel={(option) => (
					<div style={{ display: "flex", alignItems: "center" }}>
						<div>{option.label}</div>
					</div>
				)}
				styles={{
					control: (base) => ({
						...base,
						border: "1px solid #e0e0e0",
						borderRadius: "8px",
						padding: "4px",
						boxShadow: "none",
						"&:hover": {
							borderColor: "#222222",
						},
					}),
					option: (base, state) => ({
						...base,
						backgroundColor: state.isSelected
							? "#FF385C"
							: state.isFocused
							? "#FFF5F7"
							: "white",
						color: state.isSelected ? "white" : "#222222",
						"&:hover": {
							backgroundColor: state.isSelected ? "#FF385C" : "#FFF5F7",
						},
					}),
				}}
				theme={(theme) => ({
					...theme,
					borderRadius: 8,
					colors: {
						...theme.colors,
						primary: "#FF385C",
						primary25: "#FFF5F7",
					},
				})}
			/>
		</div>
	);
};

export default CitySelect;

