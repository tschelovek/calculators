// import Choices from ".//types/src/scripts/interfaces/choices";
// import Choices from "choices.js";

document.addEventListener('DOMContentLoaded', () => {
    /**
     * Калькулятор плоттерной резки
     */
    (function (): void {
        interface IFilmOptionDataset {
            priceCut?: string,
            priceExtract?: string,
            priceApplication?: string
        }

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

            const selectedOption: HTMLOptionElement = symbolsHeightSelect.options[symbolsHeightSelect.selectedIndex];
            const {priceCut, priceExtract, priceApplication}: IFilmOptionDataset = selectedOption.dataset;
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
     * Калькулятор фрезерной резки
     */
    (function () {
        type TMaterials = 'pvh' | 'acrylic' | 'plywood';

        const selectMaterial: HTMLSelectElement = <HTMLSelectElement>document.getElementById('milling_material');
        const selectThicknessPvh: HTMLSelectElement = <HTMLSelectElement>document.getElementById('milling_thickness_pvh');
        const selectThicknessAcrylic: HTMLSelectElement = <HTMLSelectElement>document.getElementById('milling_thickness_acrylic');
        const selectThicknessPlywood: HTMLSelectElement = <HTMLSelectElement>document.getElementById('milling_thickness_plywood');
        const selectHolesDiameter: HTMLSelectElement = <HTMLSelectElement>document.getElementById('milling_holes_diameter');
        const inputHolesAmount: HTMLInputElement = <HTMLInputElement>document.getElementById('milling_holes_amount');
        const checkboxMaterialClient: HTMLInputElement = <HTMLInputElement>document.getElementById('milling_material_client');
        const inputCuttingLength: HTMLInputElement = <HTMLInputElement>document.getElementById('milling_cutting_length');
        const inputArea: HTMLInputElement = <HTMLInputElement>document.getElementById('milling_sheet_area');
        const outputCut: HTMLSpanElement = <HTMLSpanElement>document.getElementById('output_milling_cut');
        const outputHoles: HTMLSpanElement = <HTMLSpanElement>document.getElementById('output_milling_holes');
        const outputMaterial: HTMLSpanElement = <HTMLSpanElement>document.getElementById('output_milling_material');
        const thicknessWrapper = document.querySelector('#calc_milling_form .thickness__wrapper');

        document.getElementById('calculate_milling').addEventListener('click', calculateMilling);
        selectMaterial.addEventListener('change', changeThicknessSelect)

        function calculateMilling(): void {
            const costCut: number = parseInt(inputCuttingLength.value) * getPriceCut() || 0;
            const costHoles: number = parseInt(inputHolesAmount.value) * getPriceHole() || 0;
            const costMaterial: number = checkboxMaterialClient.checked
                ? 0
                : parseInt(inputArea.value) * getCostMaterial() || 0;

            outputCut.textContent = formatNumber(costCut);
            outputHoles.textContent = formatNumber(costHoles);
            outputMaterial.textContent = formatNumber(costMaterial);

            function getPriceCut(): number {
                const material: TMaterials = <TMaterials>selectMaterial.options[selectMaterial.selectedIndex].value;
                // const targetSelect: HTMLSelectElement = <HTMLSelectElement>document.getElementById(`milling_thickness_${material}`)
                let targetSelect: HTMLSelectElement;
                switch (material) {
                    case('pvh'):
                        targetSelect = selectThicknessPvh;
                        break;
                    case('acrylic'):
                        targetSelect = selectThicknessAcrylic;
                        break;
                    case('plywood'):
                        targetSelect = selectThicknessPlywood;
                        break;
                }

                return parseInt(targetSelect.options[targetSelect.selectedIndex].value)
            }

            function getPriceHole(): number {
                return parseInt(selectHolesDiameter.options[selectHolesDiameter.selectedIndex].value)
            }

            function getCostMaterial(): number {
                return parseInt(selectMaterial.options[selectMaterial.selectedIndex].dataset.materialPrice);
            }
        }

        function changeThicknessSelect(): void {
            const material: TMaterials = <TMaterials>selectMaterial.options[selectMaterial.selectedIndex].value;
            const targetWrapper: HTMLDivElement = thicknessWrapper.querySelector(`.thickness_${material}`);

            Array.from(thicknessWrapper.querySelectorAll('.thickness'))
                .map((select: HTMLDivElement) => select.style.display = 'none');
            targetWrapper.style.display = 'block';
            // [
            //     selectThicknessPvh,
            //     selectThicknessAcrylic,
            //     selectThicknessPlywood,
            // ].map(select => select.style.display = 'none')
        }

        /**
         * Инициализируем селекты
         */

        // [
        //     selectThicknessPvh,
        //     selectThicknessAcrylic,
        //     selectThicknessPlywood,
        //     selectMaterial,
        //     selectHolesDiameter,
        // ].map(select => {
        //     const choices = new Choices(select, {
        //         allowHTML: false
        //     })
        // })

    })();

    const formatter = new Intl.NumberFormat("ru-RU", {});

    function formatNumber(value: number): string {
        return formatter.format(Number(value))
    }

})

