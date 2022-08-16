import { LanguageTypeEnum } from "src/app/components/logged-user/view-model/logged-user.model";
import { SelectItem } from "./select-view-model";

export class LanguageViewModel {
  languageList: SelectItem[] = [
    { ID: LanguageTypeEnum.EN, Name: "English", Url: 'en', Selected: false },
    { ID: LanguageTypeEnum.AR, Name: "العربية", Url: 'ar', Selected: false }
  ];
}
