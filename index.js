// import Choices from ".//types/src/scripts/interfaces/choices";
// import Choices from "choices.js";
document.addEventListener('DOMContentLoaded', () => {
    /**
     * Калькулятор плоттерной резки
     */
    (function () {
        const PRICE_APPLICATION_BOUNDARY = 10000;
        const inputLength = document.getElementById('plotter_length');
        const inputWidth = document.getElementById('plotter_width');
        const filmSelect = document.getElementById('plotter_film_type');
        const symbolsHeightSelect = document.getElementById('plotter_symbols_height');
        const checkboxNoFilm = document.getElementById('plotter_no_film');
        const checkboxOnlyCut = document.getElementById('plotter_only_cut');
        const checkboxApplicationNeed = document.getElementById('plotter_application');
        const outputCut = document.getElementById('output_plotter_cut');
        const outputExtract = document.getElementById('output_plotter_extract');
        const outputApplication = document.getElementById('output_plotter_application');
        const outputFilm = document.getElementById('output_plotter_film');
        const choicesPlotterSymbolsHeight = new Choices(document.getElementById('plotter_symbols_height'), {
            searchEnabled: false,
            itemSelectText: '',
            allowHTML: false,
            shouldSort: false
        });
        const choicesPlotterFilmType = new Choices(document.getElementById('plotter_film_type'), {
            searchEnabled: false,
            itemSelectText: '',
            allowHTML: false,
            shouldSort: false
        });
        document.getElementById('calculate_plotter').addEventListener('click', calculatePlotter);
        checkboxNoFilm.addEventListener('click', () => {
            checkboxNoFilm.checked
                ? choicesPlotterFilmType.disable()
                : choicesPlotterFilmType.enable();
        });
        document.getElementById('plotter_symbols_height').addEventListener('click', calculatePlotter);
        function calculatePlotter() {
            if (!inputLength.value.trim() || !inputWidth.value.trim()) {
                return;
            }
            const selectedOption = symbolsHeightSelect.options[symbolsHeightSelect.selectedIndex];
            const { priceCut, priceExtract, priceApplication } = selectedOption.dataset;
            const filmPrice = filmSelect.disabled ? 0 : parseInt(filmSelect.value);
            const areaSqCM = parseInt(inputLength.value) * parseInt(inputWidth.value);
            const areaSqM = areaSqCM / 10000;
            const costCut = Math.ceil(parseInt(priceCut) * areaSqM);
            const costExtract = checkboxOnlyCut.checked
                ? 0
                : Math.ceil(parseInt(priceExtract) * areaSqM);
            const costApplication = getCostApplication();
            const costFilm = Math.ceil(filmPrice * areaSqM);
            function getCostApplication() {
                if (checkboxApplicationNeed.checked) {
                    if (areaSqCM > PRICE_APPLICATION_BOUNDARY) {
                        return Math.ceil(parseInt(priceApplication) * areaSqM);
                    }
                    else {
                        return Math.ceil(300 * areaSqM);
                    }
                }
                return 0;
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
        const selectMaterial = document.getElementById('milling_material');
        const selectThicknessPvh = document.getElementById('milling_thickness_pvh');
        const selectThicknessAcrylic = document.getElementById('milling_thickness_acrylic');
        const selectThicknessPlywood = document.getElementById('milling_thickness_plywood');
        const selectHolesDiameter = document.getElementById('milling_holes_diameter');
        const inputHolesAmount = document.getElementById('milling_holes_amount');
        const checkboxMaterialClient = document.getElementById('milling_material_client');
        const inputCuttingLength = document.getElementById('milling_cutting_length');
        const inputArea = document.getElementById('milling_sheet_area');
        const outputCut = document.getElementById('output_milling_cut');
        const outputHoles = document.getElementById('output_milling_holes');
        const outputMaterial = document.getElementById('output_milling_material');
        const thicknessWrapper = document.querySelector('#calc_milling_form .thickness__wrapper');
        document.getElementById('calculate_milling').addEventListener('click', calculateMilling);
        selectMaterial.addEventListener('change', changeThicknessSelect);
        function calculateMilling() {
            const costCut = parseInt(inputCuttingLength.value) * getPriceCut() || 0;
            const costHoles = parseInt(inputHolesAmount.value) * getPriceHole() || 0;
            const costMaterial = checkboxMaterialClient.checked
                ? 0
                : parseInt(inputArea.value) * getCostMaterial() || 0;
            outputCut.textContent = formatNumber(costCut);
            outputHoles.textContent = formatNumber(costHoles);
            outputMaterial.textContent = formatNumber(costMaterial);
            function getPriceCut() {
                const material = selectMaterial.options[selectMaterial.selectedIndex].value;
                // const targetSelect: HTMLSelectElement = <HTMLSelectElement>document.getElementById(`milling_thickness_${material}`)
                let targetSelect;
                switch (material) {
                    case ('pvh'):
                        targetSelect = selectThicknessPvh;
                        break;
                    case ('acrylic'):
                        targetSelect = selectThicknessAcrylic;
                        break;
                    case ('plywood'):
                        targetSelect = selectThicknessPlywood;
                        break;
                }
                return parseInt(targetSelect.options[targetSelect.selectedIndex].value);
            }
            function getPriceHole() {
                return parseInt(selectHolesDiameter.options[selectHolesDiameter.selectedIndex].value);
            }
            function getCostMaterial() {
                return parseInt(selectMaterial.options[selectMaterial.selectedIndex].dataset.materialPrice);
            }
        }
        function changeThicknessSelect() {
            const material = selectMaterial.options[selectMaterial.selectedIndex].value;
            const targetWrapper = thicknessWrapper.querySelector(`.thickness_${material}`);
            Array.from(thicknessWrapper.querySelectorAll('.thickness'))
                .map((select) => select.style.display = 'none');
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
    function formatNumber(value) {
        return formatter.format(Number(value));
    }
});
//# sourceMappingURL=index.js.map