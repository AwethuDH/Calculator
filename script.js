
        document.addEventListener('DOMContentLoaded', () => {
            const display = document.querySelector('.display');
            const buttons = document.querySelectorAll('button');
            const calculatorContainer = document.querySelector('.calculator-container');
            let currentInput = '';
            let resetNext = false;
            let calculationHistory = [];

            document.addEventListener('mousemove', (e) => {
                const xAxis = (window.innerWidth / 2 - e.pageX) / 25;
                const yAxis = (window.innerHeight / 2 - e.pageY) / 25;
                calculatorContainer.style.transform = `rotateX(${yAxis}deg) rotateY(${xAxis}deg)`;
            });

            function updateDisplay(value) {
                display.textContent = value || '0';
            }

            function sanitizeInput(input) {
                return input.replace(/×/g, '*').replace(/÷/g, '/');
            }

            function calculateSquareRoot() {
                try {
                    const sanitized = sanitizeInput(currentInput);
                    const result = Math.sqrt(eval(sanitized.replace(/[^-()\d/*+.]/g, '')));
                    if (isNaN(result)) {
                        throw new Error('Invalid input');
                    }
                    calculationHistory.push(`√(${currentInput}) = ${result}`);
                    updateDisplay(result);
                    currentInput = result.toString();
                    resetNext = true;
                } catch {
                    updateDisplay('Error');
                    currentInput = '';
                    resetNext = false;
                }
            }

            function deleteLast() {
                currentInput = currentInput.slice(0, -1);
                updateDisplay(currentInput || '0');
            }

            function viewHistory() {
                if (calculationHistory.length === 0) {
                    alert('No calculation history yet.');
                } else {
                    alert('Calculation History:\n' + calculationHistory.join('\n'));
                }
            }

            buttons.forEach(button => {
                button.addEventListener('click', () => {
                    const val = button.textContent;

                    if (button.classList.contains('clear')) {
                        currentInput = '';
                        updateDisplay('0');
                        resetNext = false;
                    } else if (button.classList.contains('delete')) {
                        deleteLast();
                    } else if (button.classList.contains('equal')) {
                        try {
                            if (!currentInput) return;
                            
                            const sanitized = sanitizeInput(currentInput);
                            const validExpression = sanitized.replace(/[^-()\d/*+.]/g, '');
                            
                            if (!validExpression || /[/*+.-]{2,}/.test(validExpression)) {
                                throw new Error('Invalid expression');
                            }
                            
                            const result = eval(validExpression);
                            
                            calculationHistory.push(`${currentInput} = ${result}`);
                            
                            updateDisplay(result);
                            currentInput = result.toString();
                            resetNext = true;
                        } catch {
                            updateDisplay('Error');
                            currentInput = '';
                            resetNext = false;
                        }
                    } else if (button.classList.contains('sqrt')) {
                        if (currentInput) {
                            calculateSquareRoot();
                        }
                    } else if (button.classList.contains('history')) {
                        viewHistory();
                    } else {
                        if (resetNext) {
                            currentInput = '';
                            resetNext = false;
                        }
                        
                        if (val === '.' && currentInput.split(/[\+\-\*\/]/).pop().includes('.')) {
                            return;
                        }
                        
                        if (['+', '×', '÷', '/', '*'].includes(val) && !currentInput) {
                            return;
                        }
                        
                        const lastChar = currentInput.slice(-1);
                        if (['+', '-', '×', '÷', '/', '*'].includes(val) && 
                            ['+', '-', '×', '÷', '/', '*'].includes(lastChar)) {
                            return;
                        }
                        
                        currentInput += val;
                        updateDisplay(currentInput);
                    }
                });
            });

            updateDisplay('0');
        });
