export enum IState {
    LESS_FAMILIAR,
    PLANNED,
    IN_PROGRESS,
    LEARNED,
    DAILY
};

export function StateToString(state: IState) {
    switch (state) {
        case IState.LESS_FAMILIAR:
            return "Less Familiar";
        case IState.PLANNED:
            return "Planned";
        case IState.IN_PROGRESS:
            return "Learning In Progress";
        case IState.LEARNED:
            return "Learned";
        case IState.DAILY:
            return "Using Daily";
    }
    throw "GG"
}

export interface ISkillRecord {
    year: number
    quarter: number
    state: IState
}

export interface ISkillSelection {
    startYear: number
    startQuarter: number
    endYear: number
    endQuarter: number
    minState: IState
    maxState: IState
}

export function RecordFilter(selection: ISkillSelection, history: ISkillRecord[]) {
    return history.filter((rec) => {
        return selection.minState <= rec.state && rec.state <= selection.maxState
    }).filter((rec) => {
        if (rec.year == selection.startYear && rec.quarter < selection.startQuarter) return false;
        if (rec.year == selection.endYear && rec.quarter > selection.endQuarter) return false;
        return selection.startYear <= rec.year && rec.year <= selection.endYear;
    }
    ).sort((rec1, rec2) => {
        if (rec1.year == rec2.year) return rec1.quarter - rec2.quarter;
        return rec1.year - rec2.year;
    }).reverse()
}

interface ISkillTreeLeaf {
    name: string
    history: ISkillRecord[]
}

interface ISkillTreeParent {
    name: string
    children: ISkillTreeParent[] | ISkillTreeLeaf[]
}

export function SkillTreeReduce<OutType>(
    fLeaf: (data: ISkillTreeLeaf) => OutType,
    fParent: (data: ISkillTreeParent | null, children: OutType[]) => OutType,
    cur: ISkillTreeParent[] | ISkillTreeParent | ISkillTreeLeaf = database): OutType {
    if (Array.isArray(cur)) {
        return fParent(null, cur.map(x => SkillTreeReduce(fLeaf, fParent, x)))
    } else if ("children" in cur) {
        return fParent(cur, cur.children.map(x => SkillTreeReduce(fLeaf, fParent, x)))
    } else {
        return fLeaf(cur);
    }
}

export function SkillTreeMap<OutType>(
    fLeaf: (data: ISkillTreeLeaf) => OutType,
    fParent: (data: ISkillTreeParent | null, children: OutType[]) => OutType,
    fRoot: (children: OutType[]) => OutType[],
    cur: ISkillTreeParent[] = database): OutType[] {
    return fRoot(cur.map(x => SkillTreeReduce(fLeaf, fParent, x)));
}


const database: ISkillTreeParent[] = [
    {
        name: "OI",
        children: [
            {
                name: "DP",
                children: [
                    {
                        name: "Basic",
                        history: [{
                            year: 2014,
                            quarter: 3,
                            state: IState.IN_PROGRESS
                        }, {
                            year: 2016,
                            quarter: 3,
                            state: IState.LEARNED
                        }]
                    },
                    {
                        name: "Monotone",
                        history: [{
                            year: 2017,
                            quarter: 1,
                            state: IState.LEARNED
                        }]
                    }
                ]
            },
            {
                name: "Graph",
                children: [
                    {
                        name: "Basic",
                        history: [{
                            year: 2014,
                            quarter: 3,
                            state: IState.IN_PROGRESS
                        }, {
                            year: 2015,
                            quarter: 3,
                            state: IState.LEARNED
                        }]
                    },
                    {
                        name: "Network Flow",
                        history: [{
                            year: 2017,
                            quarter: 1,
                            state: IState.LEARNED
                        }]
                    },
                    {
                        name: "Light-weight\nDecomposition",
                        history: [{
                            year: 2017,
                            quarter: 2,
                            state: IState.LEARNED
                        },{
                            year: 2021,
                            quarter: 1,
                            state: IState.LESS_FAMILIAR
                        }]
                    }
                ]
            },
            {
                name: "Data Structure",
                children: [
                    {
                        name: "Basic",
                        history: [{
                            year: 2014,
                            quarter: 3,
                            state: IState.IN_PROGRESS
                        }, {
                            year: 2015,
                            quarter: 3,
                            state: IState.LEARNED
                        }]
                    },
                    {
                        name: "Splay",
                        history: [{
                            year: 2017,
                            quarter: 2,
                            state: IState.LEARNED
                        },{
                            year: 2021,
                            quarter: 1,
                            state: IState.LESS_FAMILIAR
                        }]
                    },
                    {
                        name: "ZKW",
                        history: [{
                            year: 2017,
                            quarter: 2,
                            state: IState.LEARNED
                        },{
                            year: 2021,
                            quarter: 1,
                            state: IState.LESS_FAMILIAR
                        }]
                    },
                ]
            },
            {
                name: "String",
                children: [
                    {
                        name: "AC",
                        history: [{
                            year: 2017,
                            quarter: 1,
                            state: IState.LEARNED
                        },{
                            year: 2021,
                            quarter: 1,
                            state: IState.LESS_FAMILIAR
                        }]
                    },
                    {
                        name: "SA",
                        history: [{
                            year: 2017,
                            quarter: 1,
                            state: IState.IN_PROGRESS
                        }, {
                            year: 2017,
                            quarter: 2,
                            state: IState.LEARNED
                        },{
                            year: 2021,
                            quarter: 1,
                            state: IState.LESS_FAMILIAR
                        }]
                    }
                ]
            },
            {
                name: "Combinatorials",
                children: [
                    {
                        name: "FFT",
                        history: [{
                            year: 2017,
                            quarter: 2,
                            state: IState.IN_PROGRESS
                        }, {
                            year: 2018,
                            quarter: 2,
                            state: IState.LEARNED
                        },{
                            year: 2021,
                            quarter: 1,
                            state: IState.LESS_FAMILIAR
                        }]
                    }
                ]
            }
        ]
    },
    {
        name: "Framework",
        children: [
            {
                name: "PyTorch",
                children: [
                    {
                        name: "Allocator",
                        history: [{
                            year: 2023,
                            quarter: 4,
                            state: IState.LEARNED
                        }]
                    },
                    {
                        name: "Eager Mode\nDispatcher",
                        history: [{
                            year: 2023,
                            quarter: 3,
                            state: IState.LEARNED
                        }]
                    },
                    {
                        name: "TorchBench",
                        history: [{
                            year: 2023,
                            quarter: 3,
                            state: IState.LEARNED
                        }]
                    },
                    {
                        name: "Dynamo",
                        history: [{
                            year: 2023,
                            quarter: 4,
                            state: IState.LEARNED
                        }]
                    },
                    {
                        name: "FX\nPasses",
                        history: [{
                            year: 2024,
                            quarter: 1,
                            state: IState.LEARNED
                        }]
                    },
                    {
                        name: "Inductor\nIR",
                        history: [{
                            year: 2024,
                            quarter: 1,
                            state: IState.LEARNED
                        }]
                    },
                    {
                        name: "Inductor\nCodeGen",
                        history: [{
                            year: 2024,
                            quarter: 1,
                            state: IState.LEARNED
                        }]
                    }
                ]
            },
            {
                name: "Triton",
                children: [
                    {
                        name: "TTIR",
                        history: [{
                            year: 2023,
                            quarter: 4,
                            state: IState.LEARNED
                        }]
                    },
                    {
                        name: "TTGIR",
                        history: [{
                            year: 2023,
                            quarter: 4,
                            state: IState.IN_PROGRESS
                        }]
                    }

                ]
            }
        ]
    },
    {
        name: "ML Kernel",
        children: [
            {
                name: "SIMD",
                children: [
                    {
                        name: "Pointwise",
                        history: [{
                            year: 2024,
                            quarter: 2,
                            state: IState.LEARNED
                        }]
                    }
                ]
            },
            {
                name: "CUDA",
                children: [
                    {
                        name: "Pointwise",
                        history: [{
                            year: 2024,
                            quarter: 2,
                            state: IState.PLANNED
                        }]
                    },
                    {
                        name: "Reduction",
                        history: [{
                            year: 2024,
                            quarter: 2,
                            state: IState.PLANNED
                        }]
                    },
                    {
                        name: "Matmul",
                        history: [{
                            year: 2024,
                            quarter: 2,
                            state: IState.PLANNED
                        }]
                    },
                ]
            },
            {
                name: "CUTLass",
                children: [
                    {
                        name: "MatMul",
                        history: [{
                            year: 2024,
                            quarter: 2,
                            state: IState.PLANNED
                        }]
                    }
                ]
            },
            {
                name: "Triton",
                children: [
                    {
                        name: "MatMul",
                        history: [{
                            year: 2023,
                            quarter: 4,
                            state: IState.LEARNED
                        }]
                    },
                    {
                        name: "Flash\nAttention",
                        history: [{
                            year: 2024,
                            quarter: 1,
                            state: IState.LEARNED
                        }]
                    },
                ]
            }
        ]
    },
    {
        name: "Compilers",
        children: [
            {
                name: "LLVM",
                children: [
                    {
                        name: "Loop\nVectorizer",
                        history: [{
                            year: 2024,
                            quarter: 2,
                            state: IState.PLANNED
                        }]
                    },
                    {
                        name: "MLIR",
                        history: [{
                            year: 2023,
                            quarter: 3,
                            state: IState.LEARNED
                        }]
                    }
                ]
            },
            {
                name: "Theory",
                children: [
                    {
                        name: "Monad",
                        history: [{
                            year: 2022,
                            quarter: 4,
                            state: IState.LEARNED
                        }]
                    },
                    {
                        name: "Type",
                        history: [{
                            year: 2022,
                            quarter: 4,
                            state: IState.LEARNED
                        }]
                    }
                ]
            }
        ]
    },
    {
        name: "ML",
        children: [
            {
                name: "Basics",
                children: [
                    {
                        name: "BP",
                        history: [{
                            year: 2019,
                            quarter: 3,
                            state: IState.IN_PROGRESS
                        }, {
                            year: 2020,
                            quarter: 1,
                            state: IState.LEARNED
                        }]
                    },
                    {
                        name: "Classicals",
                        history: [{
                            year: 2020,
                            quarter: 4,
                            state: IState.LEARNED
                        }]
                    }]
            },
            {
                name: "GNN",
                children: [
                    {
                        name: "PlanE",
                        history: [{
                            year: 2023,
                            quarter: 2,
                            state: IState.LEARNED
                        }]
                    }]
            },
            {
                name: "LLM Deploy",
                children: [
                    {
                        name: "KV Cache",
                        history: [{
                            year: 2024,
                            quarter: 1,
                            state: IState.LEARNED
                        }]
                    },
                    {
                        name: "Continous\nBatching",
                        history: [{
                            year: 2024,
                            quarter: 1,
                            state: IState.LEARNED
                        }]
                    }
                ]
            }
        ]
    },
    {
        name: "Web",
        children: [
            {
                name: "Frontend",
                children: [
                    {
                        name: "Visualization",
                        history: [{
                            year: 2021,
                            quarter: 3,
                            state: IState.PLANNED
                        }]
                    },
                    {
                        name: "React",
                        history: [{
                            year: 2021,
                            quarter: 2,
                            state: IState.PLANNED
                        }]
                    },
                    {
                        name: "WebRTC",
                        history: [{
                            year: 2023,
                            quarter: 4,
                            state: IState.PLANNED
                        }]
                    }
                ]
            }
        ]
    },
    {
        name: "Programming",
        children: [
            {
                name: "OI",
                children: [
                    {
                        name: "Free Pascal",
                        history: [{
                            year: 2014,
                            quarter: 3,
                            state: IState.LEARNED
                        }]
                    },
                    {
                        name: "C++",
                        history: [{
                            year: 2016,
                            quarter: 3,
                            state: IState.DAILY
                        }]
                    }
                ]
            },
            {
                name: "Project",
                children: [
                    {
                        name: "C++",
                        history: [{
                            year: 2024,
                            quarter: 1,
                            state: IState.DAILY
                        }]
                    },
                    {
                        name: "TypeScript",
                        history: [{
                            year: 2021,
                            quarter: 2,
                            state: IState.LEARNED
                        }]
                    },
                    {
                        name: "Python",
                        history: [{
                            year: 2019,
                            quarter: 3,
                            state: IState.LEARNED
                        }, {
                            year: 2020,
                            quarter: 3,
                            state: IState.DAILY
                        }]
                    },
                ]
            },
            {
                name: "Course",
                children: [
                    {
                        name: "Java",
                        history: [{
                            year: 2017,
                            quarter: 3,
                            state: IState.LEARNED
                        }, {
                            year: 2023,
                            quarter: 4,
                            state: IState.LESS_FAMILIAR
                        }]
                    },
                    {
                        name: "Haskell",
                        history: [{
                            year: 2019,
                            quarter: 4,
                            state: IState.LEARNED
                        }, {
                            year: 2023,
                            quarter: 4,
                            state: IState.LESS_FAMILIAR
                        }]
                    }
                ]
            }
        ]
    }
];
