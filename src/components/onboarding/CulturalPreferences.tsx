import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { MapPin } from "lucide-react";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";

interface CulturalPreferencesProps {
  form: UseFormReturn<any>;
}

// Comprehensive list of countries with their cuisines
const COUNTRIES_AND_CUISINES = [
  { value: "afghanistan", label: "Afghanistan", cuisine: "Afghan Cuisine" },
  { value: "albania", label: "Albania", cuisine: "Albanian Cuisine" },
  { value: "algeria", label: "Algeria", cuisine: "Algerian Cuisine" },
  { value: "andorra", label: "Andorra", cuisine: "Andorran Cuisine" },
  { value: "angola", label: "Angola", cuisine: "Angolan Cuisine" },
  { value: "antigua-and-barbuda", label: "Antigua and Barbuda", cuisine: "Antiguan Cuisine" },
  { value: "argentina", label: "Argentina", cuisine: "Argentinian Cuisine" },
  { value: "armenia", label: "Armenia", cuisine: "Armenian Cuisine" },
  { value: "australia", label: "Australia", cuisine: "Australian Cuisine" },
  { value: "austria", label: "Austria", cuisine: "Austrian Cuisine" },
  { value: "azerbaijan", label: "Azerbaijan", cuisine: "Azerbaijani Cuisine" },
  { value: "bahamas", label: "Bahamas", cuisine: "Bahamian Cuisine" },
  { value: "bahrain", label: "Bahrain", cuisine: "Bahraini Cuisine" },
  { value: "bangladesh", label: "Bangladesh", cuisine: "Bangladeshi Cuisine" },
  { value: "barbados", label: "Barbados", cuisine: "Barbadian Cuisine" },
  { value: "belarus", label: "Belarus", cuisine: "Belarusian Cuisine" },
  { value: "belgium", label: "Belgium", cuisine: "Belgian Cuisine" },
  { value: "belize", label: "Belize", cuisine: "Belizean Cuisine" },
  { value: "benin", label: "Benin", cuisine: "Beninese Cuisine" },
  { value: "bhutan", label: "Bhutan", cuisine: "Bhutanese Cuisine" },
  { value: "bolivia", label: "Bolivia", cuisine: "Bolivian Cuisine" },
  { value: "bosnia-and-herzegovina", label: "Bosnia and Herzegovina", cuisine: "Bosnian Cuisine" },
  { value: "botswana", label: "Botswana", cuisine: "Botswanan Cuisine" },
  { value: "brazil", label: "Brazil", cuisine: "Brazilian Cuisine" },
  { value: "brunei", label: "Brunei", cuisine: "Bruneian Cuisine" },
  { value: "bulgaria", label: "Bulgaria", cuisine: "Bulgarian Cuisine" },
  { value: "burkina-faso", label: "Burkina Faso", cuisine: "Burkinabe Cuisine" },
  { value: "burundi", label: "Burundi", cuisine: "Burundian Cuisine" },
  { value: "cabo-verde", label: "Cabo Verde", cuisine: "Cape Verdean Cuisine" },
  { value: "cambodia", label: "Cambodia", cuisine: "Cambodian Cuisine" },
  { value: "cameroon", label: "Cameroon", cuisine: "Cameroonian Cuisine" },
  { value: "canada", label: "Canada", cuisine: "Canadian Cuisine" },
  { value: "central-african-republic", label: "Central African Republic", cuisine: "Central African Cuisine" },
  { value: "chad", label: "Chad", cuisine: "Chadian Cuisine" },
  { value: "chile", label: "Chile", cuisine: "Chilean Cuisine" },
  { value: "china", label: "China", cuisine: "Chinese Cuisine" },
  { value: "colombia", label: "Colombia", cuisine: "Colombian Cuisine" },
  { value: "comoros", label: "Comoros", cuisine: "Comorian Cuisine" },
  { value: "congo", label: "Congo", cuisine: "Congolese Cuisine" },
  { value: "costa-rica", label: "Costa Rica", cuisine: "Costa Rican Cuisine" },
  { value: "croatia", label: "Croatia", cuisine: "Croatian Cuisine" },
  { value: "cuba", label: "Cuba", cuisine: "Cuban Cuisine" },
  { value: "cyprus", label: "Cyprus", cuisine: "Cypriot Cuisine" },
  { value: "czech-republic", label: "Czech Republic", cuisine: "Czech Cuisine" },
  { value: "democratic-republic-of-the-congo", label: "Democratic Republic of the Congo", cuisine: "Congolese Cuisine" },
  { value: "denmark", label: "Denmark", cuisine: "Danish Cuisine" },
  { value: "djibouti", label: "Djibouti", cuisine: "Djiboutian Cuisine" },
  { value: "dominica", label: "Dominica", cuisine: "Dominican Cuisine" },
  { value: "dominican-republic", label: "Dominican Republic", cuisine: "Dominican Cuisine" },
  { value: "ecuador", label: "Ecuador", cuisine: "Ecuadorian Cuisine" },
  { value: "egypt", label: "Egypt", cuisine: "Egyptian Cuisine" },
  { value: "el-salvador", label: "El Salvador", cuisine: "Salvadoran Cuisine" },
  { value: "equatorial-guinea", label: "Equatorial Guinea", cuisine: "Equatorial Guinean Cuisine" },
  { value: "eritrea", label: "Eritrea", cuisine: "Eritrean Cuisine" },
  { value: "estonia", label: "Estonia", cuisine: "Estonian Cuisine" },
  { value: "eswatini", label: "Eswatini", cuisine: "Swazi Cuisine" },
  { value: "ethiopia", label: "Ethiopia", cuisine: "Ethiopian Cuisine" },
  { value: "fiji", label: "Fiji", cuisine: "Fijian Cuisine" },
  { value: "finland", label: "Finland", cuisine: "Finnish Cuisine" },
  { value: "france", label: "France", cuisine: "French Cuisine" },
  { value: "gabon", label: "Gabon", cuisine: "Gabonese Cuisine" },
  { value: "gambia", label: "Gambia", cuisine: "Gambian Cuisine" },
  { value: "georgia", label: "Georgia", cuisine: "Georgian Cuisine" },
  { value: "germany", label: "Germany", cuisine: "German Cuisine" },
  { value: "ghana", label: "Ghana", cuisine: "Ghanaian Cuisine" },
  { value: "greece", label: "Greece", cuisine: "Greek Cuisine" },
  { value: "grenada", label: "Grenada", cuisine: "Grenadian Cuisine" },
  { value: "guatemala", label: "Guatemala", cuisine: "Guatemalan Cuisine" },
  { value: "guinea", label: "Guinea", cuisine: "Guinean Cuisine" },
  { value: "guinea-bissau", label: "Guinea-Bissau", cuisine: "Guinean Cuisine" },
  { value: "haiti", label: "Haiti", cuisine: "Haitian Cuisine" },
  { value: "honduras", label: "Honduras", cuisine: "Honduran Cuisine" },
  { value: "hungary", label: "Hungary", cuisine: "Hungarian Cuisine" },
  { value: "iceland", label: "Iceland", cuisine: "Icelandic Cuisine" },
  { value: "india", label: "India", cuisine: "Indian Cuisine" },
  { value: "indonesia", label: "Indonesia", cuisine: "Indonesian Cuisine" },
  { value: "iran", label: "Iran", cuisine: "Iranian Cuisine" },
  { value: "iraq", label: "Iraq", cuisine: "Iraqi Cuisine" },
  { value: "ireland", label: "Ireland", cuisine: "Irish Cuisine" },
  { value: "israel", label: "Israel", cuisine: "Israeli Cuisine" },
  { value: "italy", label: "Italy", cuisine: "Italian Cuisine" },
  { value: "jamaica", label: "Jamaica", cuisine: "Jamaican Cuisine" },
  { value: "japan", label: "Japan", cuisine: "Japanese Cuisine" },
  { value: "jordan", label: "Jordan", cuisine: "Jordanian Cuisine" },
  { value: "kazakhstan", label: "Kazakhstan", cuisine: "Kazakh Cuisine" },
  { value: "kenya", label: "Kenya", cuisine: "Kenyan Cuisine" },
  { value: "kiribati", label: "Kiribati", cuisine: "I-Kiribati Cuisine" },
  { value: "korea-north", label: "North Korea", cuisine: "North Korean Cuisine" },
  { value: "korea-south", label: "South Korea", cuisine: "South Korean Cuisine" },
  { value: "kuwait", label: "Kuwait", cuisine: "Kuwaiti Cuisine" },
  { value: "kyrgyzstan", label: "Kyrgyzstan", cuisine: "Kyrgyz Cuisine" },
  { value: "laos", label: "Laos", cuisine: "Laotian Cuisine" },
  { value: "latvia", label: "Latvia", cuisine: "Latvian Cuisine" },
  { value: "lebanon", label: "Lebanon", cuisine: "Lebanese Cuisine" },
  { value: "lesotho", label: "Lesotho", cuisine: "Basotho Cuisine" },
  { value: "liberia", label: "Liberia", cuisine: "Liberian Cuisine" },
  { value: "libya", label: "Libya", cuisine: "Libyan Cuisine" },
  { value: "liechtenstein", label: "Liechtenstein", cuisine: "Liechtenstein Cuisine" },
  { value: "lithuania", label: "Lithuania", cuisine: "Lithuanian Cuisine" },
  { value: "luxembourg", label: "Luxembourg", cuisine: "Luxembourgish Cuisine" },
  { value: "madagascar", label: "Madagascar", cuisine: "Malagasy Cuisine" },
  { value: "malawi", label: "Malawi", cuisine: "Malawian Cuisine" },
  { value: "malaysia", label: "Malaysia", cuisine: "Malaysian Cuisine" },
  { value: "maldives", label: "Maldives", cuisine: "Maldivian Cuisine" },
  { value: "mali", label: "Mali", cuisine: "Malian Cuisine" },
  { value: "malta", label: "Malta", cuisine: "Maltese Cuisine" },
  { value: "marshall-islands", label: "Marshall Islands", cuisine: "Marshallese Cuisine" },
  { value: "mauritania", label: "Mauritania", cuisine: "Mauritanian Cuisine" },
  { value: "mauritius", label: "Mauritius", cuisine: "Mauritian Cuisine" },
  { value: "mexico", label: "Mexico", cuisine: "Mexican Cuisine" },
  { value: "micronesia", label: "Micronesia", cuisine: "Micronesian Cuisine" },
  { value: "moldova", label: "Moldova", cuisine: "Moldovan Cuisine" },
  { value: "monaco", label: "Monaco", cuisine: "Monacan Cuisine" },
  { value: "mongolia", label: "Mongolia", cuisine: "Mongolian Cuisine" },
  { value: "montenegro", label: "Montenegro", cuisine: "Montenegrin Cuisine" },
  { value: "morocco", label: "Morocco", cuisine: "Moroccan Cuisine" },
  { value: "mozambique", label: "Mozambique", cuisine: "Mozambican Cuisine" },
  { value: "myanmar", label: "Myanmar", cuisine: "Burmese Cuisine" },
  { value: "namibia", label: "Namibia", cuisine: "Namibian Cuisine" },
  { value: "nauru", label: "Nauru", cuisine: "Nauruan Cuisine" },
  { value: "nepal", label: "Nepal", cuisine: "Nepalese Cuisine" },
  { value: "netherlands", label: "Netherlands", cuisine: "Dutch Cuisine" },
  { value: "new-zealand", label: "New Zealand", cuisine: "New Zealand Cuisine" },
  { value: "nicaragua", label: "Nicaragua", cuisine: "Nicaraguan Cuisine" },
  { value: "niger", label: "Niger", cuisine: "Nigerien Cuisine" },
  { value: "nigeria", label: "Nigeria", cuisine: "Nigerian Cuisine" },
  { value: "north-macedonia", label: "North Macedonia", cuisine: "Macedonian Cuisine" },
  { value: "norway", label: "Norway", cuisine: "Norwegian Cuisine" },
  { value: "oman", label: "Oman", cuisine: "Omani Cuisine" },
  { value: "pakistan", label: "Pakistan", cuisine: "Pakistani Cuisine" },
  { value: "palau", label: "Palau", cuisine: "Palauan Cuisine" },
  { value: "palestine", label: "Palestine", cuisine: "Palestinian Cuisine" },
  { value: "panama", label: "Panama", cuisine: "Panamanian Cuisine" },
  { value: "papua-new-guinea", label: "Papua New Guinea", cuisine: "Papua New Guinean Cuisine" },
  { value: "paraguay", label: "Paraguay", cuisine: "Paraguayan Cuisine" },
  { value: "peru", label: "Peru", cuisine: "Peruvian Cuisine" },
  { value: "philippines", label: "Philippines", cuisine: "Filipino Cuisine" },
  { value: "poland", label: "Poland", cuisine: "Polish Cuisine" },
  { value: "portugal", label: "Portugal", cuisine: "Portuguese Cuisine" },
  { value: "qatar", label: "Qatar", cuisine: "Qatari Cuisine" },
  { value: "romania", label: "Romania", cuisine: "Romanian Cuisine" },
  { value: "russia", label: "Russia", cuisine: "Russian Cuisine" },
  { value: "rwanda", label: "Rwanda", cuisine: "Rwandan Cuisine" },
  { value: "saint-kitts-and-nevis", label: "Saint Kitts and Nevis", cuisine: "Kittitian Cuisine" },
  { value: "saint-lucia", label: "Saint Lucia", cuisine: "Saint Lucian Cuisine" },
  { value: "saint-vincent-and-the-grenadines", label: "Saint Vincent and the Grenadines", cuisine: "Vincentian Cuisine" },
  { value: "samoa", label: "Samoa", cuisine: "Samoan Cuisine" },
  { value: "san-marino", label: "San Marino", cuisine: "Sammarinese Cuisine" },
  { value: "sao-tome-and-principe", label: "São Tomé and Príncipe", cuisine: "São Toméan Cuisine" },
  { value: "saudi-arabia", label: "Saudi Arabia", cuisine: "Saudi Cuisine" },
  { value: "senegal", label: "Senegal", cuisine: "Senegalese Cuisine" },
  { value: "serbia", label: "Serbia", cuisine: "Serbian Cuisine" },
  { value: "singapore", label: "Singapore", cuisine: "Singaporean Cuisine" },
  { value: "slovakia", label: "Slovakia", cuisine: "Slovak Cuisine" },
  { value: "slovenia", label: "Slovenia", cuisine: "Slovenian Cuisine" },
  { value: "solomon-islands", label: "Solomon Islands", cuisine: "Solomon Islander Cuisine" },
  { value: "somalia", label: "Somalia", cuisine: "Somali Cuisine" },
  { value: "south-africa", label: "South Africa", cuisine: "South African Cuisine" },
  { value: "south-sudan", label: "South Sudan", cuisine: "South Sudanese Cuisine" },
  { value: "spain", label: "Spain", cuisine: "Spanish Cuisine" },
  { value: "sri-lanka", label: "Sri Lanka", cuisine: "Sri Lankan Cuisine" },
  { value: "sudan", label: "Sudan", cuisine: "Sudanese Cuisine" },
  { value: "suriname", label: "Suriname", cuisine: "Surinamese Cuisine" },
  { value: "sweden", label: "Sweden", cuisine: "Swedish Cuisine" },
  { value: "switzerland", label: "Switzerland", cuisine: "Swiss Cuisine" },
  { value: "syria", label: "Syria", cuisine: "Syrian Cuisine" },
  { value: "taiwan", label: "Taiwan", cuisine: "Taiwanese Cuisine" },
  { value: "tajikistan", label: "Tajikistan", cuisine: "Tajik Cuisine" },
  { value: "tanzania", label: "Tanzania", cuisine: "Tanzanian Cuisine" },
  { value: "thailand", label: "Thailand", cuisine: "Thai Cuisine" },
  { value: "togo", label: "Togo", cuisine: "Togolese Cuisine" },
  { value: "tonga", label: "Tonga", cuisine: "Tongan Cuisine" },
  { value: "trinidad-and-tobago", label: "Trinidad and Tobago", cuisine: "Trinidadian Cuisine" },
  { value: "tunisia", label: "Tunisia", cuisine: "Tunisian Cuisine" },
  { value: "turkey", label: "Turkey", cuisine: "Turkish Cuisine" },
  { value: "turkmenistan", label: "Turkmenistan", cuisine: "Turkmen Cuisine" },
  { value: "tuvalu", label: "Tuvalu", cuisine: "Tuvaluan Cuisine" },
  { value: "uganda", label: "Uganda", cuisine: "Ugandan Cuisine" },
  { value: "ukraine", label: "Ukraine", cuisine: "Ukrainian Cuisine" },
  { value: "united-arab-emirates", label: "United Arab Emirates", cuisine: "Emirati Cuisine" },
  { value: "united-kingdom", label: "United Kingdom", cuisine: "British Cuisine" },
  { value: "united-states", label: "United States", cuisine: "American Cuisine" },
  { value: "uruguay", label: "Uruguay", cuisine: "Uruguayan Cuisine" },
  { value: "uzbekistan", label: "Uzbekistan", cuisine: "Uzbek Cuisine" },
  { value: "vanuatu", label: "Vanuatu", cuisine: "Ni-Vanuatu Cuisine" },
  { value: "venezuela", label: "Venezuela", cuisine: "Venezuelan Cuisine" },
  { value: "vietnam", label: "Vietnam", cuisine: "Vietnamese Cuisine" },
  { value: "zambia", label: "Zambia", cuisine: "Zambian Cuisine" },
  { value: "zimbabwe", label: "Zimbabwe", cuisine: "Zimbabwean Cuisine" },
];

const CUISINE_PREFERENCES = [
  { value: "traditional", label: "Strictly Traditional" },
  { value: "modern", label: "Modern Fusion" },
  { value: "mixed", label: "Mix of Both" },
];

const detectUserLocation = async () => {
  try {
    const response = await fetch('https://ipapi.co/json/');
    const data = await response.json();
    return data.country_code.toLowerCase();
  } catch (error) {
    throw new Error('Failed to detect location');
  }
};

export const CulturalPreferences = ({ form }: CulturalPreferencesProps) => {
  const { data: detectedCountry, isLoading } = useQuery({
    queryKey: ['userLocation'],
    queryFn: detectUserLocation,
    retry: 1,
  });

  const handleCountrySelect = (value: string) => {
    form.setValue("country", value);
    localStorage.setItem("userCountry", value);
    const cuisine = COUNTRIES_AND_CUISINES.find(c => c.value === value)?.cuisine || "";
    localStorage.setItem("userCuisine", cuisine);
  };

  const handleCuisineStyleSelect = (value: string) => {
    form.setValue("cuisineStyle", value);
    localStorage.setItem("cuisineStyle", value);
  };

  const handleAutoDetect = () => {
    if (detectedCountry) {
      handleCountrySelect(detectedCountry);
      toast.success("Location detected successfully!");
    }
  };

  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="country"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center justify-between">
              Country
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAutoDetect}
                disabled={isLoading}
                className="flex items-center gap-2"
              >
                <MapPin className="h-4 w-4" />
                {isLoading ? "Detecting..." : "Auto-detect"}
              </Button>
            </FormLabel>
            <Select onValueChange={handleCountrySelect} defaultValue={field.value}>
              <SelectTrigger>
                <SelectValue placeholder="Select your country" />
              </SelectTrigger>
              <SelectContent className="bg-white max-h-[300px]">
                {COUNTRIES_AND_CUISINES.map((country) => (
                  <SelectItem key={country.value} value={country.value}>
                    {country.label} - {country.cuisine}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="cuisineStyle"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Preferred Cuisine Style</FormLabel>
            <Select onValueChange={handleCuisineStyleSelect} defaultValue={field.value}>
              <SelectTrigger>
                <SelectValue placeholder="Select your preferred style" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {CUISINE_PREFERENCES.map((style) => (
                  <SelectItem key={style.value} value={style.value}>
                    {style.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormItem>
        )}
      />
    </div>
  );
};
