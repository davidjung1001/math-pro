export const PRACTICE_SET_OPTIONS = [
    'Practice Set 1',
    'Practice Set 2',
    'Practice Set 3',
    'Practice Set 4',
    'Practice Set 5',
];

export const INITIAL_DATA = [
    {
        id: 'algebra-1',
        title: 'Algebra I Fundamentals',
        subsections: [
            {
                id: 'linear-equations',
                title: 'Solving Linear Equations',
                description: 'Mastering the techniques to isolate variables in one and two-step equations.',
                // Note: 'lessonContent' will be rendered via a utility function in the actual LessonView.
                lessonContent: 'A linear equation in one variable is an equation that can be written in the form $ax + b = 0$, where $a$ and $b$ are real numbers and $a \\neq 0$. The goal of solving is to isolate the variable, $x$. Key operations include: 1) **Addition/Subtraction Property of Equality:** Add or subtract the same value from both sides. 2) **Multiplication/Division Property of Equality:** Multiply or divide both sides by the same non-zero value. Example: To solve $2x + 5 = 11$, first subtract 5: $2x = 6$. Then divide by 2: $x = 3$. Always check your solution by plugging it back into the original equation.',
                practiceSets: [
                    {
                        name: 'Practice Set 1', 
                        // The questions will be the same for all 5 sets for simplicity, 
                        // but the LessonView only uses the name for display/selection.
                        questions: [
                            {
                                question: 'Solve for $x$: $3x - 7 = 14$',
                                options: { A: '5', B: '7', C: '6', D: '4' },
                                correctAnswer: 'B',
                            },
                            {
                                question: 'Solve for $y$: $\\frac{y}{4} + 2 = 6$',
                                options: { A: '16', B: '8', C: '4', D: '12' },
                                correctAnswer: 'A',
                            },
                            {
                                question: 'What is the value of $z$ if $5z + 10 = 25$?',
                                options: { A: '3', B: '4', C: '5', D: '6' },
                                correctAnswer: 'A',
                            },
                            {
                                question: 'Solve for $k$: $10 - 2k = 4$',
                                options: { A: '3', B: '2', C: '-3', D: '-2' },
                                correctAnswer: 'A',
                            },
                            {
                                question: 'The equation $6x = 18$ is solved by:',
                                options: { A: 'Adding 6', B: 'Subtracting 18', C: 'Multiplying by 6', D: 'Dividing by 6' },
                                correctAnswer: 'D',
                            },
                        ]
                    },
                ]
            },
            {
                id: 'quadratics',
                title: 'Introduction to Quadratics',
                description: 'Understanding the standard form of a quadratic equation and its roots.',
                lessonContent: 'A quadratic equation is an equation of the second degree, meaning it contains at least one term that is squared. The standard form is $ax^2 + bx + c = 0$, where $a \\neq 0$. The graph of a quadratic equation is a parabola. Solutions (or roots) can be found by factoring, completing the square, or using the Quadratic Formula: $x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$.',
                practiceSets: [
                    {
                        name: 'Practice Set 1',
                        questions: [
                            {
                                question: 'Which of the following is the standard form of a quadratic equation?',
                                options: { A: '$ax + b = 0$', B: '$a/x = b$', C: '$ax^2 + bx + c = 0$', D: '$x^3 + x^2 = 1$' },
                                correctAnswer: 'C',
                            },
                            {
                                question: 'Factor the expression: $x^2 - 9$',
                                options: { A: '$(x+3)(x-3)$', B: '$(x-3)^2$', C: '$(x+3)^2$', D: '$(x+9)(x-1)$' },
                                correctAnswer: 'A',
                            },
                            {
                                question: 'The shape of a quadratic equation\'s graph is a:',
                                options: { A: 'Hyperbola', B: 'Parabola', C: 'Circle', D: 'Line' },
                                correctAnswer: 'B',
                            },
                            {
                                question: 'In $2x^2 + 5x - 3 = 0$, what is the value of $a$?',
                                options: { A: '5', B: '2', C: '-3', D: '0' },
                                correctAnswer: 'B',
                            },
                            {
                                question: 'How many solutions can a quadratic equation have?',
                                options: { A: 'Zero, one, or two', B: 'Exactly one', C: 'Always two', D: 'Infinite' },
                                correctAnswer: 'A',
                            },
                        ]
                    },
                ]
            },
        ],
    },
    {
        id: 'geometry-1',
        title: 'Basic Plane Geometry',
        subsections: [
            {
                id: 'triangles',
                title: 'Area and Perimeter of Triangles',
                description: 'Formulas and calculation practice for the most common polygon.',
                lessonContent: 'The **Perimeter** of a triangle is the sum of the lengths of its three sides ($P = a + b + c$). The **Area** of a triangle is calculated using the formula $A = \\frac{1}{2}bh$, where $b$ is the base and $h$ is the height perpendicular to the base. For right triangles, the Pythagorean theorem, $a^2 + b^2 = c^2$, relates the side lengths.',
                practiceSets: [
                    {
                        name: 'Practice Set 1',
                        questions: [
                            {
                                question: 'Find the area of a triangle with a base of 8cm and a height of 5cm.',
                                options: { A: '40 $cm^2$', B: '20 $cm^2$', C: '13 $cm^2$', D: '26 $cm^2$' },
                                correctAnswer: 'B',
                            },
                            {
                                question: 'What is the perimeter of a triangle with sides 5, 12, and 13 units?',
                                options: { A: '25', B: '30', C: '35', D: '18' },
                                correctAnswer: 'B',
                            },
                            {
                                question: 'If the area of a triangle is 10 and the base is 5, what is the height?',
                                options: { A: '2', B: '4', C: '5', D: '10' },
                                correctAnswer: 'B',
                            },
                            {
                                question: 'In a right triangle, if the legs are 3 and 4, what is the hypotenuse ($c^2 = a^2 + b^2$)?',
                                options: { A: '5', B: '6', C: '7', D: '25' },
                                correctAnswer: 'A',
                            },
                            {
                                question: 'The formula $A = \\frac{1}{2}bh$ calculates the triangle\'s:',
                                options: { A: 'Perimeter', B: 'Volume', C: 'Area', D: 'Hypotenuse' },
                                correctAnswer: 'C',
                            },
                        ]
                    },
                ]
            },
        ],
    },
];
