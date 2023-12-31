// import Choices from ".//types/src/scripts/interfaces/choices";
// import Choices from "choices.js";

document.addEventListener('DOMContentLoaded', () => {
    /**
     * Калькулятор плоттерной резки
     */
    (function (): void {
        const PRICE_APPLICATION_BOUNDARY: number = 10000;
        const inputLength: HTMLInputElement = <HTMLInputElement>document.getElementById('plotter_length');
        const inputWidth: HTMLInputElement = <HTMLInputElement>document.getElementById('plotter_width');
        const filmSelect: HTMLSelectElement = <HTMLSelectElement>document.getElementById('plotter_film_type');
        const symbolsHeightSelect: HTMLSelectElement = <HTMLSelectElement>document.getElementById('plotter_symbols_height');
        const checkboxNoFilm: HTMLInputElement = <HTMLInputElement>document.getElementById('plotter_no_film');
        const checkboxOnlyCut: HTMLInputElement = <HTMLInputElement>document.getElementById('plotter_only_cut');
        const checkboxApplicationNeed: HTMLInputElement = <HTMLInputElement>document.getElementById('plotter_application');
        const outputCut: HTMLSpanElement = <HTMLSpanElement>document.getElementById('output_plotter_cut');
        const outputExtract: HTMLSpanElement = <HTMLSpanElement>document.getElementById('output_plotter_extract');
        const outputApplication: HTMLSpanElement = <HTMLSpanElement>document.getElementById('output_plotter_application');
        const outputFilm: HTMLSpanElement = <HTMLSpanElement>document.getElementById('output_plotter_film');

        const choicesPlotterSymbolsHeight = new Choices(
            document.getElementById('plotter_symbols_height'),
            {
                searchEnabled: false,
                itemSelectText: '',
                allowHTML: false,
                shouldSort: false
            }
        );
        const choicesPlotterFilmType = new Choices(
            document.getElementById('plotter_film_type'),
            {
                searchEnabled: false,
                itemSelectText: '',
                allowHTML: false,
                shouldSort: false
            }
        );
        document.getElementById('calculate_plotter').addEventListener('click', calculatePlotter);
        checkboxNoFilm.addEventListener('click', () => {
            checkboxNoFilm.checked
                ? choicesPlotterFilmType.disable()
                : choicesPlotterFilmType.enable()
        });

        document.getElementById('plotter_symbols_height').addEventListener('click', calculatePlotter);

        function calculatePlotter(): void {
            if (!inputLength.value.trim() || !inputWidth.value.trim()) {
                return
            }

            const dataContainer: HTMLDivElement = symbolsHeightSelect.closest('.plotter_symbols_data-container');
            const suffix: string = "_" + (symbolsHeightSelect.value).toString();
            const {
                [`priceCut${suffix}`]: priceCut,
                [`priceExtract${suffix}`]: priceExtract,
                [`priceApplication${suffix}`]: priceApplication
            } = dataContainer.dataset;
            const filmPrice: number = filmSelect.disabled ? 0 : parseInt(filmSelect.value);

            const areaSqCM: number = parseInt(inputLength.value) * parseInt(inputWidth.value);
            const areaSqM: number = areaSqCM / 10000;

            const costCut: number = Math.ceil(parseInt(priceCut) * areaSqM);
            const costExtract: number = checkboxOnlyCut.checked
                ? 0
                : Math.ceil(parseInt(priceExtract) * areaSqM);
            const costApplication: number = getCostApplication();
            const costFilm: number = Math.ceil(filmPrice * areaSqM);

            function getCostApplication(): number {
                if (checkboxApplicationNeed.checked) {
                    if (areaSqCM > PRICE_APPLICATION_BOUNDARY) {
                        return Math.ceil(parseInt(priceApplication) * areaSqM);
                    } else {
                        return Math.ceil(300 * areaSqM)
                    }
                }
                return 0
            }

            outputCut.textContent = formatNumber(costCut);
            outputExtract.textContent = formatNumber(costExtract);
            outputApplication.textContent = formatNumber(costApplication);
            outputFilm.textContent = formatNumber(costFilm);
        }
    })();

    /**
     * Калькуляторы фрезерной и лазерной резки
     */
    (function () {

        type TMaterials = 'm_pvh' | 'm_acrylic' | 'm_plywood' | 'l_acrylic' | 'l_plexiglas' | 'l_pet';

        //* Получаем значение цены из атрибута обёртки селекта
        function getDatasetPriceBySelect(select: HTMLSelectElement): number {
            const dataContainer: HTMLDivElement = select.closest('.data-container');
            const value: string = select.value;

            return parseInt(dataContainer.dataset[`price_${value}`]) || 0
        }

        /**
         * Калькулятор фрезерной резки
         */
        const selectMillingMaterial: HTMLSelectElement = <HTMLSelectElement>document.getElementById('milling_material');
        const selectMillingThicknessPvh: HTMLSelectElement = <HTMLSelectElement>document.getElementById('milling_thickness_pvh');
        const selectMillingThicknessAcrylic: HTMLSelectElement = <HTMLSelectElement>document.getElementById('milling_thickness_acrylic');
        const selectMillingThicknessPlywood: HTMLSelectElement = <HTMLSelectElement>document.getElementById('milling_thickness_plywood');
        const selectHolesDiameter: HTMLSelectElement = <HTMLSelectElement>document.getElementById('milling_holes_diameter');
        const inputHolesAmount: HTMLInputElement = <HTMLInputElement>document.getElementById('milling_holes_amount');
        const checkboxMillingMaterialClient: HTMLInputElement = <HTMLInputElement>document.getElementById('milling_material_client');
        const inputMillingCuttingLength: HTMLInputElement = <HTMLInputElement>document.getElementById('milling_cutting_length');
        const inputMillingArea: HTMLInputElement = <HTMLInputElement>document.getElementById('milling_sheet_area');
        const outputMillingCut: HTMLSpanElement = <HTMLSpanElement>document.getElementById('output_milling_cut');
        const outputMillingHoles: HTMLSpanElement = <HTMLSpanElement>document.getElementById('output_milling_holes');
        const outputMillingMaterial: HTMLSpanElement = <HTMLSpanElement>document.getElementById('output_milling_material');
        const outputMillingTotal: HTMLSpanElement = <HTMLSpanElement>document.getElementById('output_milling_total');
        const thicknessMillingWrapper = document.querySelector('#calc_milling_form .thickness__wrapper');

        //* Инициализируем селекты и сразу дисейблим скрытые
        const choicesMillingMaterial = new Choices(selectMillingMaterial,
            {
                searchEnabled: false,
                itemSelectText: '',
                allowHTML: false,
                shouldSort: false
            }
        );
        const choicesMillingThicknessPvh = new Choices(selectMillingThicknessPvh,
            {
                searchEnabled: false,
                itemSelectText: '',
                allowHTML: false,
                shouldSort: false
            }
        );
        const choicesMillingThicknessAcrylic = new Choices(selectMillingThicknessAcrylic,
            {
                searchEnabled: false,
                itemSelectText: '',
                allowHTML: false,
                shouldSort: false
            }
        ).disable();
        const choicesMillingThicknessPlywood = new Choices(selectMillingThicknessPlywood,
            {
                searchEnabled: false,
                itemSelectText: '',
                allowHTML: false,
                shouldSort: false
            }
        ).disable();
        const choicesMillingHolesDiameter = new Choices(selectHolesDiameter,
            {
                searchEnabled: false,
                itemSelectText: '',
                allowHTML: false,
                shouldSort: false
            }
        );

        const choicesMillingThicknessArr = [
            choicesMillingThicknessPvh,
            choicesMillingThicknessAcrylic,
            choicesMillingThicknessPlywood
        ]

        document.getElementById('calculate_milling').addEventListener('click', calculateMilling);
        selectMillingMaterial.addEventListener('change', handlerThicknessSelect)

        function calculateMilling(): void {
            const costCut: number = parseInt(inputMillingCuttingLength.value) * getPriceCut() || 0;
            const costHoles: number = parseInt(inputHolesAmount.value) * getPriceHole() || 0;
            const costMaterial: number = checkboxMillingMaterialClient.checked
                ? 0
                : parseInt(inputMillingArea.value) * getPriceMaterial() || 0;

            outputMillingCut.textContent = formatNumber(costCut);
            outputMillingHoles.textContent = formatNumber(costHoles);
            outputMillingMaterial.textContent = formatNumber(costMaterial);
            outputMillingTotal.textContent = formatNumber(costCut + costHoles + costMaterial);

            function getPriceCut(): number {
                const material: TMaterials = <TMaterials>selectMillingMaterial.value;
                let targetSelect: HTMLSelectElement;

                switch (material) {
                    case('m_pvh'):
                        targetSelect = selectMillingThicknessPvh;
                        break;
                    case('m_acrylic'):
                        targetSelect = selectMillingThicknessAcrylic;
                        break;
                    case('m_plywood'):
                        targetSelect = selectMillingThicknessPlywood;
                        break;
                }

                return getDatasetPriceBySelect(targetSelect)
            }

            function getPriceHole(): number {
                return getDatasetPriceBySelect(selectHolesDiameter)
            }

            function getPriceMaterial(): number {
                return getDatasetPriceBySelect(selectMillingMaterial)
            }
        }

        function handlerThicknessSelect(event): void {
            const material: TMaterials = <TMaterials>event.target.value;
            const targetWrapper: HTMLDivElement = <HTMLDivElement>document.querySelector(`.thickness_${material}`);

            if (material.startsWith('m')) {
                choicesMillingThicknessArr.map(choiceJs => choiceJs.disable())
                Array.from(thicknessMillingWrapper.querySelectorAll('.thickness'))
                    .map((selectWrapper: HTMLDivElement) => selectWrapper.style.display = 'none');
            }
            if (material.startsWith('l')) {
                choicesLaserThicknessArr.map(choiceJs => choiceJs.disable())
                Array.from(thicknessLaserWrapper.querySelectorAll('.thickness'))
                    .map((selectWrapper: HTMLDivElement) => selectWrapper.style.display = 'none');
            }

            targetWrapper.style.display = 'block';
            enableThicknessSelect(material)
        }

        function enableThicknessSelect(material: TMaterials): void {
            switch (material) {
                case('m_pvh'):
                    choicesMillingThicknessPvh.enable()
                    break;
                case('m_acrylic'):
                    choicesMillingThicknessAcrylic.enable()
                    break;
                case('m_plywood'):
                    choicesMillingThicknessPlywood.enable()
                    break;
                case('l_acrylic'):
                    choicesLaserThicknessAcrylic.enable()
                    break;
                case('l_plexiglas'):
                    choicesLaserThicknessPlexiglas.enable()
                    break;
                case('l_pet'):
                    choicesLaserThicknessPet.enable()
                    break;
            }
        }

        /**
         * Калькулятор лазерной резки
         */
        const selectLaserMaterial: HTMLSelectElement = <HTMLSelectElement>document.getElementById('laser_material');
        const selectLaserThicknessAcrylic: HTMLSelectElement = <HTMLSelectElement>document.getElementById('laser_thickness_acrylic');
        const selectLaserThicknessPlexiglas: HTMLSelectElement = <HTMLSelectElement>document.getElementById('laser_thickness_plexiglas');
        const selectLaserThicknessPet: HTMLSelectElement = <HTMLSelectElement>document.getElementById('laser_thickness_pet');
        const checkboxLaserMaterialClient: HTMLInputElement = <HTMLInputElement>document.getElementById('laser_material_client');
        const inputLaserCuttingLength: HTMLInputElement = <HTMLInputElement>document.getElementById('laser_cutting_length');
        const inputLaserSheetArea: HTMLInputElement = <HTMLInputElement>document.getElementById('laser_sheet_area');
        const inputLaserSheetAmount: HTMLInputElement = <HTMLInputElement>document.getElementById('laser_sheet_amount');
        const outputLaserCut: HTMLSpanElement = <HTMLSpanElement>document.getElementById('output_laser_cut');
        const outputLaserMaterial: HTMLSpanElement = <HTMLSpanElement>document.getElementById('output_laser_material');
        const outputLaserTotal: HTMLSpanElement = <HTMLSpanElement>document.getElementById('output_laser_total');
        const thicknessLaserWrapper = document.querySelector('#calc_laser_form .thickness__wrapper');

        //* Инициализируем селекты и сразу дисейблим скрытые
        const choicesLaserMaterial = new Choices(selectLaserMaterial,
            {
                searchEnabled: false,
                itemSelectText: '',
                allowHTML: false,
                shouldSort: false
            }
        );
        const choicesLaserThicknessAcrylic = new Choices(selectLaserThicknessAcrylic,
            {
                searchEnabled: false,
                itemSelectText: '',
                allowHTML: false,
                shouldSort: false
            }
        );
        const choicesLaserThicknessPlexiglas = new Choices(selectLaserThicknessPlexiglas,
            {
                searchEnabled: false,
                itemSelectText: '',
                allowHTML: false,
                shouldSort: false
            }
        ).disable();
        const choicesLaserThicknessPet = new Choices(selectLaserThicknessPet,
            {
                searchEnabled: false,
                itemSelectText: '',
                allowHTML: false,
                shouldSort: false
            }
        ).disable();

        const choicesLaserThicknessArr = [
            choicesLaserThicknessAcrylic,
            choicesLaserThicknessPlexiglas,
            choicesLaserThicknessPet
        ]

        document.getElementById('calculate_laser').addEventListener('click', calculateLaser);
        selectLaserMaterial.addEventListener('change', handlerThicknessSelect);

        function calculateLaser() {
            const costCut: number = parseInt(inputLaserCuttingLength.value) * getPriceCut() || 0;
            const costMaterial: number = checkboxLaserMaterialClient.checked
                ? 0
                : parseInt(inputLaserSheetArea.value) * parseInt(inputLaserSheetAmount.value) * getPriceMaterial() || 0;

            outputLaserCut.textContent = formatNumber(costCut);
            outputLaserMaterial.textContent = formatNumber(costMaterial);
            outputLaserTotal.textContent = formatNumber(costCut + costMaterial);

            function getPriceCut(): number {
                const material: TMaterials = <TMaterials>selectLaserMaterial.value;
                let targetSelect: HTMLSelectElement;
                switch (material) {
                    case('l_acrylic'):
                        targetSelect = selectLaserThicknessAcrylic;
                        break;
                    case('l_plexiglas'):
                        targetSelect = selectLaserThicknessPlexiglas;
                        break;
                    case('l_pet'):
                        targetSelect = selectLaserThicknessPet;
                        break;
                }

                return getDatasetPriceBySelect(targetSelect)
            }

            function getPriceMaterial(): number {
                return getDatasetPriceBySelect(selectLaserMaterial)
            }
        }
    })();

    const formatter = new Intl.NumberFormat("ru-RU", {});

    function formatNumber(value: number): string {
        return formatter.format(Number(value))
    }
})

