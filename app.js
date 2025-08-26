// Εφαρμογή Τεχνικής Υπηρεσίας - Δήμος Αρχανών Αστερουσίων
class TechnicalServiceApp {
    constructor() {
        this.currentRole = null;
        this.projects = [];
        this.subprojects = [];
        this.selectedFiles = [];
        this.currentEditingSubproject = null;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadExistingData();
    }

    setupEventListeners() {
        // Role selection
        document.getElementById('changeRoleBtn').addEventListener('click', () => this.showRoleSelection());
        
        // Main actions
        document.getElementById('addSubprojectBtn').addEventListener('click', () => this.showSubprojectModal());
        
        // Modal controls
        document.getElementById('closeSubprojectModal').addEventListener('click', () => this.hideSubprojectModal());
        document.getElementById('closeFilesModal').addEventListener('click', () => this.hideFilesModal());
        
        // Form submissions
        document.getElementById('subprojectForm').addEventListener('submit', (e) => this.saveSubproject(e));
        
        // Cancel buttons
        document.getElementById('cancelSubproject').addEventListener('click', () => this.hideSubprojectModal());
        
        // Search and filter
        document.getElementById('searchInput').addEventListener('input', (e) => this.handleSearch(e.target.value));
        document.getElementById('filterSelect').addEventListener('change', (e) => this.handleFilter(e.target.value));
        
        // File handling
        document.getElementById('selectFilesBtn').addEventListener('click', () => document.getElementById('fileInput').click());
        document.getElementById('fileInput').addEventListener('change', (e) => this.handleFileSelection(e));
        
        // Dynamic form fields
        document.getElementById('status').addEventListener('change', (e) => this.handleStatusChange(e.target.value));
        // Event listeners για φόρμα υποέργου
        document.getElementById('fundingSource').addEventListener('change', (e) => {
            this.setupFundingSpecializations();
        });
    }

    selectRole(role) {
        this.currentRole = role;
        this.hideRoleSelection();
        this.showMainApp();
        this.updateRoleDisplay();
        this.loadProjects();
    }

    showRoleSelection() {
        document.getElementById('mainAppPage').classList.add('hidden');
        document.getElementById('roleSelectionPage').classList.remove('hidden');
    }

    hideRoleSelection() {
        document.getElementById('roleSelectionPage').classList.add('hidden');
    }

    showMainApp() {
        document.getElementById('mainAppPage').classList.remove('hidden');
    }

    updateRoleDisplay() {
        const roleText = this.currentRole === 'admin' ? 'ΔΙΑΧΕΙΡΙΣΤΗΣ' : 'ΧΡΗΣΤΗΣ';
        document.getElementById('currentRoleDisplay').textContent = roleText;
        
        // Απόκρυψη κουμπιού προσθήκης ανάλογα με τον ρόλο
        if (this.currentRole === 'user') {
            document.getElementById('addSubprojectBtn').classList.add('hidden');
        } else {
            document.getElementById('addSubprojectBtn').classList.remove('hidden');
        }
    }

    showSubprojectModal() {
        document.getElementById('subprojectModal').classList.remove('hidden');
        this.resetForm();
        this.setupFundingSpecializations();
    }

    hideSubprojectModal() {
        document.getElementById('subprojectModal').classList.add('hidden');
        this.resetForm();
    }

    showFilesModal(projectId, subprojectId) {
        this.currentProject = projectId;
        this.currentSubproject = subprojectId;
        document.getElementById('filesFolderModal').classList.remove('hidden');
        this.loadFilesList(projectId, subprojectId);
    }

    hideFilesModal() {
        document.getElementById('filesFolderModal').classList.add('hidden');
        this.currentProject = null;
        this.currentSubproject = null;
    }

    resetForm() {
        document.getElementById('subprojectForm').reset();
        this.selectedFiles = [];
        this.updateSelectedFilesDisplay();
        this.hideContractFields();
        
        // Καθαρισμός επεξεργασίας
        this.currentEditingSubproject = null;
        
        // Ενεργοποίηση πεδίου τίτλου έργου
        document.getElementById('projectTitle').disabled = false;
        document.getElementById('projectTitle').classList.remove('bg-gray-100', 'cursor-not-allowed');
        
        // Επαναφορά κειμένου κουμπιού αποθήκευσης
        const submitBtn = document.querySelector('#subprojectForm button[type="submit"]');
        submitBtn.innerHTML = '<i class="fas fa-save mr-2"></i> ΑΠΟΘΗΚΕΥΣΗ ΥΠΟΕΡΓΟΥ';
    }

    setupFundingSpecializations() {
        const fundingSource = document.getElementById('fundingSource');
        const specialization = document.getElementById('fundingSpecialization');
        
        fundingSource.addEventListener('change', (e) => {
            this.populateFundingSpecializations(e.target.value);
        });
    }

    populateFundingSpecializations(fundingSource) {
        const specialization = document.getElementById('fundingSpecialization');
        specialization.innerHTML = '<option value="">Επιλέξτε εξειδίκευση...</option>';
        
        const specializations = this.getFundingSpecializations(fundingSource);
        specializations.forEach(spec => {
            const option = document.createElement('option');
            option.value = spec.value;
            option.textContent = spec.label;
            specialization.appendChild(option);
        });
    }

    getFundingSpecializations(fundingSource) {
        const specializations = {
            'antoni_tritsi': [
                { value: 'AT01', label: 'ΑΤ01. Υποδομές ύδρευσης' },
                { value: 'AT02', label: 'ΑΤ02. Ολοκληρωμένη διαχείριση αστικών λυμάτων' },
                { value: 'AT03', label: 'ΑΤ03. Παρεμβάσεις και δράσεις βελτίωσης της διαχείρισης ενέργειας και αξιοποίηση Ανανεώσιμων Πηγών Ενέργειας στις υποδομές διαχείρισης υδάτων και λυμάτων' },
                { value: 'AT04', label: 'ΑΤ04. Χωριστή Συλλογή Βιοαποβλήτων, Γωνιές Ανακύκλωσης και Σταθμοί Μεταφόρτωσης Απορριμμάτων' },
                { value: 'AT05', label: 'ΑΤ05. Ανάπτυξη της υπαίθρου-Αγροτική Οδοποιία' },
                { value: 'AT06', label: 'ΑΤ06. Αστική Αναζωογόνηση' },
                { value: 'AT07', label: 'ΑΤ07. Αξιοποίηση του κτιριακού αποθέματος των Δήμων' },
                { value: 'AT08', label: 'ΑΤ08. Smart cities, ευφυείς εφαρμογές, συστήματα και πλατφόρμες για την ασφάλεια, υγεία - πρόνοια, ηλεκτρονική διακυβέρνηση….' },
                { value: 'AT09', label: 'ΑΤ09. Ωρίμανση έργων και δράσεων για την υλοποίηση του Προγράμματος' },
                { value: 'AT10', label: 'ΑΤ10. Συντήρηση δημοτικών ανοιχτών αθλητικών χώρων, σχολικών μονάδων, προσβασιμότητα ΑμΕΑ' },
                { value: 'AT11', label: 'ΑΤ11. Δράσεις για υποδομές που χρήζουν αντισεισμικής προστασίας (προσεισμικός έλεγχος)' },
                { value: 'AT12', label: 'ΑΤ12. Δράσεις Ηλεκτροκίνησης στους Δήμους' },
                { value: 'AT13', label: 'ΑΤ13. Έργα αντιπλημμυρικής προστασίας' },
                { value: 'AT14', label: 'ΑΤ14. Ελλάδα 1821 - Ελλάδα 2021' }
            ],
            'filodimos_ii': [
                { value: 'P000', label: 'Π000. Επιχορήγηση των Δήμων της χώρας από το πρόγραμμα «Φιλόδημος ΙΙ» βάσει της 30292/19.04.2019 υπουργικής απόφασης' },
                { value: 'P001', label: 'Π001. Προμήθεια μηχανημάτων έργου, οχημάτων ή/και συνοδευτικού εξοπλισμού' },
                { value: 'P002', label: 'Π002. Επισκευή, συντήρηση σχολικών κτιρίων & αύλειων χώρων και λοιπές δράσεις' },
                { value: 'P003', label: 'Π003. Προμήθεια-τοποθέτηση εξοπλισμού για την αναβάθμιση παιδικών χαρών των δήμων της Χώρας' },
                { value: 'P004', label: 'Π004. Κατασκευή, επισκευή και συντήρηση αθλητικών εγκαταστάσεων των Δήμων' },
                { value: 'P005', label: 'Π005. Προμήθεια εξοπλισμού, κατασκευή, μεταφορά και τοποθέτηση στεγάστρων, για την δημιουργία ή και αναβάθμιση των στάσεων.' },
                { value: 'P006', label: 'Π006. Σύνταξη / Επικαιροποίηση Γενικών Σχεδίων Ύδρευσης (Masterplan) και Σύνταξη / Επικαιροποίηση Σχεδίων Ασφάλειας Νερού' },
                { value: 'P007', label: 'Π007. Σύνταξη / Επικαιροποίηση Σχεδίων και Μελετών στο πλαίσιο της κατασκευής, βελτίωσης και συντήρησης των λιμενικών υποδομών των Δημοτικών Λιμενικών Ταμείων και Γραφείων.' },
                { value: 'P008', label: 'Π008. Εκπόνηση μελετών και υλοποίηση μέτρων και μέσων πυροπροστασίας στις σχολικές μονάδες της χώρας' },
                { value: 'P009', label: 'Π009. Κατασκευή ραμπών και χώρων υγιεινής για την πρόσβαση και την εξυπηρέτηση ΑΜΕΑ σε σχολικές μονάδες' },
                { value: 'P010', label: 'Π010. Κατασκευή, επισκευή, συντήρηση και εξοπλισμός εγκαταστάσεων καταφυγίων αδέσποτων ζώων συντροφιάς.' },
                { value: 'P011', label: 'Π011. Ειδική Επιχορήγηση των δήμων οι οποίοι έχουν συσταθεί δυνάμει του άρθρου 154 του Ν. 4600/2019' },
                { value: 'P012', label: 'Π012. Κατασκευή, επισκευή, συντήρηση και εξοπλισμός εγκαταστάσεων καταφυγίων αδέσποτων ζώων συντροφιάς – Πρόγραμμα «Άργος»' },
                { value: 'P099', label: 'Π099. Λοιπές περιπτώσεις (διευκρινίστε στη στήλη ΠΑΡΑΤΗΡΗΣΕΙΣ)' }
            ]
        };
        
        return specializations[fundingSource] || [];
    }

    handleStatusChange(status) {
        if (status === 'executing' || status === 'completed') {
            this.showContractFields();
        } else {
            this.hideContractFields();
        }
    }

    showContractFields() {
        document.getElementById('contractFields').classList.remove('hidden');
    }

    hideContractFields() {
        document.getElementById('contractFields').classList.add('hidden');
    }

    handleFileSelection(event) {
        const files = Array.from(event.target.files);
        this.selectedFiles = files;
        this.updateSelectedFilesDisplay();
    }

    updateSelectedFilesDisplay() {
        const container = document.getElementById('selectedFiles');
        container.innerHTML = '';
        
        this.selectedFiles.forEach((file, index) => {
            const fileDiv = document.createElement('div');
            fileDiv.className = 'flex items-center justify-between bg-white rounded-lg p-3 border border-gray-200';
            fileDiv.innerHTML = `
                <div class="flex items-center space-x-3">
                    <i class="fas fa-file-pdf text-red-500"></i>
                    <span class="text-sm text-gray-700">${file.name}</span>
                    <span class="text-xs text-gray-500">(${(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                </div>
                <button type="button" onclick="app.removeFile(${index})" class="text-red-500 hover:text-red-700">
                    <i class="fas fa-times"></i>
                </button>
            `;
            container.appendChild(fileDiv);
        });
    }

    removeFile(index) {
        this.selectedFiles.splice(index, 1);
        this.updateSelectedFilesDisplay();
    }

    async loadExistingData() {
        try {
            await this.createBaseDirectory();
            await this.loadProjects();
        } catch (error) {
            console.error('Σφάλμα φόρτωσης δεδομένων:', error);
        }
    }

    async createBaseDirectory() {
        try {
            if (window.electronAPI) {
                // Electron mode - δημιουργία φακέλου στον δίσκο
                const result = await window.electronAPI.createBaseDirectory();
                if (result.success) {
                    this.baseDirectoryPath = result.path;
                    return true;
                } else {
                    throw new Error(result.error);
                }
            } else {
                // Web mode - fallback
                return true;
            }
        } catch (error) {
            console.error('Σφάλμα δημιουργίας βασικού φακέλου:', error);
            return false;
        }
    }

    async createProjectDirectory(projectTitle) {
        try {
            if (window.electronAPI) {
                const result = await window.electronAPI.createProjectDirectory(projectTitle);
                if (result.success) {
                    return result.path;
                } else {
                    throw new Error(result.error);
                }
            } else {
                return null;
            }
        } catch (error) {
            console.error('Σφάλμα δημιουργίας φακέλου έργου:', error);
            return null;
        }
    }

    async createSubprojectDirectory(projectPath, subprojectTitle) {
        try {
            if (window.electronAPI) {
                const result = await window.electronAPI.createSubprojectDirectory(projectPath, subprojectTitle);
                if (result.success) {
                    return result.path;
                } else {
                    throw new Error(result.error);
                }
            } else {
                return null;
            }
        } catch (error) {
            console.error('Σφάλμα δημιουργίας φακέλου υποέργου:', error);
            return null;
        }
    }

    async saveToFileSystem(subprojectData) {
        try {
            if (!window.electronAPI) {
                // Web mode - μόνο localStorage
                return true;
            }

            // Δημιουργία φακέλου έργου
            const projectPath = await this.createProjectDirectory(subprojectData.projectTitle);
            if (!projectPath) {
                throw new Error('Δεν μπόρεσε να δημιουργηθεί ο φάκελος έργου');
            }

            // Δημιουργία φακέλου υποέργου
            const subprojectPath = await this.createSubprojectDirectory(projectPath, subprojectData.subprojectTitle);
            if (!subprojectPath) {
                throw new Error('Δεν μπόρεσε να δημιουργηθεί ο φάκελος υποέργου');
            }

            // Αποθήκευση JSON αρχείου με τα δεδομένα
            const jsonFilePath = `${subprojectPath}/subproject_data.json`;
            const jsonResult = await window.electronAPI.saveJsonFile(jsonFilePath, subprojectData);
            if (!jsonResult.success) {
                throw new Error('Σφάλμα αποθήκευσης JSON: ' + jsonResult.error);
            }

            // Αποθήκευση PDF αρχείων
            if (subprojectData.pdfFilesBase64 && subprojectData.pdfFilesBase64.length > 0) {
                for (const pdfFile of subprojectData.pdfFilesBase64) {
                    const pdfFilePath = `${subprojectPath}/${pdfFile.name}`;
                    const pdfResult = await window.electronAPI.savePdfFile(pdfFilePath, pdfFile.data);
                    if (!pdfResult.success) {
                        console.warn(`Σφάλμα αποθήκευσης PDF ${pdfFile.name}:`, pdfResult.error);
                    }
                }
            }

            // Αποθήκευση διαδρομών φακέλων στο subprojectData
            subprojectData.projectPath = projectPath;
            subprojectData.subprojectPath = subprojectPath;

            return true;
        } catch (error) {
            console.error('Σφάλμα αποθήκευσης στο σύστημα αρχείων:', error);
            throw error;
        }
    }

    async loadProjects() {
        try {
            this.showLoading();
            
            // Φόρτωση από localStorage (fallback)
            const savedProjects = localStorage.getItem('technicalService_projects');
            const savedSubprojects = localStorage.getItem('technicalService_subprojects');
            
            if (savedProjects) {
                this.projects = JSON.parse(savedProjects);
            }
            
            if (savedSubprojects) {
                this.subprojects = JSON.parse(savedSubprojects);
            }
            
            // Φόρτωση PDF αρχείων από localStorage αν υπάρχουν
            this.loadPdfFilesFromStorage();
            
            this.displayProjects();
            this.hideLoading();
        } catch (error) {
            console.error('Σφάλμα φόρτωσης έργων:', error);
            this.hideLoading();
            this.showEmptyState();
        }
    }

    loadPdfFilesFromStorage() {
        // Φόρτωση PDF αρχείων από localStorage
        this.subprojects.forEach(subproject => {
            if (subproject.pdfFilesBase64) {
                // Τα PDF αρχεία είναι ήδη σε base64 μορφή
                // Δεν χρειάζεται επιπλέον μετατροπή
            }
        });
    }

    showLoading() {
        document.getElementById('loadingState').classList.remove('hidden');
        document.getElementById('projectsContainer').classList.add('hidden');
        document.getElementById('emptyState').classList.add('hidden');
    }

    hideLoading() {
        document.getElementById('loadingState').classList.add('hidden');
        document.getElementById('projectsContainer').classList.remove('hidden');
    }

    showEmptyState() {
        document.getElementById('emptyState').classList.remove('hidden');
        document.getElementById('projectsContainer').classList.add('hidden');
    }

    displayProjects() {
        const container = document.getElementById('projectsContainer');
        
        if (this.subprojects.length === 0) {
            this.showEmptyState();
            return;
        }
        
        // Ομαδοποίηση υποέργων ανά έργο
        const projectsMap = new Map();
        
        this.subprojects.forEach(subproject => {
            if (!projectsMap.has(subproject.projectTitle)) {
                projectsMap.set(subproject.projectTitle, []);
            }
            projectsMap.get(subproject.projectTitle).push(subproject);
        });
        
        let html = '';
        
        projectsMap.forEach((subprojects, projectTitle) => {
            html += this.renderProjectCard(projectTitle, subprojects);
        });
        
        container.innerHTML = html;
    }

    renderProjectCard(projectTitle, subprojects) {
        return `
            <div class="bg-white rounded-2xl shadow-lg p-6 card-hover">
                <div class="flex items-center justify-between mb-6">
                    <h2 class="text-2xl font-bold text-gray-800">${projectTitle}</h2>
                    <span class="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full font-medium">
                        ${subprojects.length} Υποέργα
                    </span>
                </div>
                
                <div class="space-y-4">
                    ${subprojects.map(subproject => this.renderSubprojectCard(subproject)).join('')}
                </div>
            </div>
        `;
    }

    renderSubprojectCard(subproject) {
        return `
            <div class="bg-gray-50 rounded-xl p-4 border-l-4 border-blue-500">
                <div class="flex items-start justify-between">
                    <div class="flex-1">
                        <h3 class="text-lg font-semibold text-gray-800 mb-2">${subproject.subprojectTitle}</h3>
                        
                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                            <div>
                                <span class="font-medium text-gray-600">ΚΑ Κωδικός:</span>
                                <span class="ml-2 text-gray-800">${subproject.kaCode}</span>
                            </div>
                            <div>
                                <span class="font-medium text-gray-600">Εγκεκριμένο Ποσό:</span>
                                <span class="ml-2 text-gray-800 font-semibold">€${subproject.approvedAmount}</span>
                            </div>
                            <div>
                                <span class="font-medium text-gray-600">Κατάσταση:</span>
                                <span class="ml-2 px-2 py-1 rounded-full text-xs ${this.getStatusColor(subproject.status)}">${this.getStatusLabel(subproject.status)}</span>
                            </div>
                            <div>
                                <span class="font-medium text-gray-600">Είδος:</span>
                                <span class="ml-2 text-gray-800">${this.getTypeLabel(subproject.type)}</span>
                            </div>
                            <div>
                                <span class="font-medium text-gray-600">Πηγή:</span>
                                <span class="ml-2 text-gray-800">${this.getFundingSourceLabel(subproject.fundingSource)}</span>
                            </div>
                            ${subproject.contractAmount ? `
                                <div>
                                    <span class="font-medium text-gray-600">Ποσό Σύμβασης:</span>
                                    <span class="ml-2 text-gray-800 font-semibold">€${subproject.contractAmount}</span>
                                </div>
                            ` : ''}
                            ${subproject.supervisor ? `
                                <div>
                                    <span class="font-medium text-gray-600">Επιβλέπων:</span>
                                    <span class="ml-2 text-gray-800">${subproject.supervisor}</span>
                                </div>
                            ` : ''}
                        </div>
                        
                        ${subproject.comments ? `
                            <div class="mt-3 pt-3 border-t border-gray-200">
                                <span class="font-medium text-gray-600">Σχόλια:</span>
                                <p class="mt-1 text-gray-700">${subproject.comments}</p>
                            </div>
                        ` : ''}
                        
                        ${subproject.pdfFilesBase64 && subproject.pdfFilesBase64.length > 0 ? `
                            <div class="mt-3 pt-3 border-t border-gray-200">
                                <span class="font-medium text-gray-600">PDF Αρχεία:</span>
                                <p class="text-sm text-gray-500 mt-1">${subproject.pdfFilesBase64.length} αρχείο(α)</p>
                            </div>
                        ` : ''}
                    </div>
                    
                    <div class="flex items-center space-x-2 ml-4">
                        <button onclick="app.showFilesModal('${subproject.projectTitle}', '${subproject.subprojectId}')" 
                                class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm">
                            <i class="fas fa-folder-open mr-2"></i>
                            ΦΑΚΕΛΟΣ ΑΡΧΕΙΩΝ
                        </button>
                        
                        ${this.currentRole === 'admin' ? `
                            <button onclick="app.openProjectFolder('${subproject.projectTitle}', '${subproject.subprojectId}')" 
                                    class="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors text-sm">
                                <i class="fas fa-external-link-alt mr-2"></i>
                                ΑΝΟΙΓΜΑ ΦΑΚΕΛΟΥ
                            </button>
                            <button onclick="app.editSubproject('${subproject.projectTitle}', '${subproject.subprojectId}')" 
                                    class="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors text-sm">
                                <i class="fas fa-edit mr-2"></i>
                                ΕΠΕΞΕΡΓΑΣΙΑ
                            </button>
                            <button onclick="app.deleteSubproject('${subproject.projectTitle}', '${subproject.subprojectId}')" 
                                    class="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm">
                                <i class="fas fa-trash mr-2"></i>
                                ΔΙΑΓΡΑΦΗ
                            </button>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;
    }

    getStatusColor(status) {
        const colors = {
            'pending': 'bg-yellow-100 text-yellow-800',
            'contract': 'bg-blue-100 text-blue-800',
            'executing': 'bg-green-100 text-green-800',
            'completed': 'bg-gray-100 text-gray-800'
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    }

    getStatusLabel(status) {
        const labels = {
            'pending': 'ΥΠΟ ΒΡΑΧΥΠΡΟΘΕΣΜΗ ΩΡΙΜΑΝΣΗ',
            'contract': 'ΣΕ ΔΙΑΔΙΚΑΣΙΑ ΣΥΝΑΨΗΣ ΣΥΜΒΑΣΗΣ',
            'executing': 'ΕΚΤΕΛΟΥΜΕΝΟ - ΣΥΜΒΑΣΙΟΠΟΙΗΜΕΝΟ',
            'completed': 'ΟΛΟΚΛΗΡΩΜΕΝΟ'
        };
        return labels[status] || status;
    }

    getTypeLabel(type) {
        const labels = {
            'procurement': 'ΠΡΟΜΗΘΕΙΑ',
            'work': 'ΕΡΓΟ',
            'study': 'ΜΕΛΕΤΗ',
            'service': 'ΥΠΗΡΕΣΙΑ'
        };
        return labels[type] || type;
    }

    getFundingSourceLabel(source) {
        const labels = {
            'antoni_tritsi': 'ΠΡΟΓΡΑΜΜΑ ΑΝΤΩΝΗΣ ΤΡΙΤΣΗΣ',
            'filodimos_ii': 'ΠΡΟΓΡΑΜΜΑ ΦΙΛΟΔΗΜΟΣ ΙΙ',
            'pde_ypes_sae055': 'ΠΔΕ ΥΠΕΣ ΣΑΕ055',
            'espa_2014_2020': 'ΕΣΠΑ 2014_2020',
            'espa_2021_2027': 'ΕΣΠΑ 2021_2027',
            'ethniko_pde': 'ΕΘΝΙΚΟ ΠΔΕ',
            'epa_2021_2025': 'ΕΠΑ_2021_2025',
            'tameio_anakampsis': 'ΤΑΜΕΙΟ ΑΝΑΚΑΜΨΗΣ και ΑΝΘΕΚΤΙΚΟΤΗΤΑΣ',
            'loipa_programmata': 'ΛΟΙΠΑ ΠΡΟΓΡΑΜΜΑΤΑ ή ΠΟΡΟΙ'
        };
        return labels[source] || source;
    }

    async saveSubproject(e) {
        e.preventDefault();
        
        try {
            // Μετατροπή ποσών σε σωστή μορφή
            const approvedAmount = document.getElementById('approvedAmount').value;
            const contractAmount = document.getElementById('contractAmount').value;
            const additionalContracts = document.getElementById('additionalContracts').value;
            
            // Επιβεβαίωση μορφής ποσών
            const amountPattern = /^[0-9]{1,3}(\.[0-9]{3})*(,[0-9]{2})?$/;
            if (!amountPattern.test(approvedAmount)) {
                this.showToast('Λάθος μορφή εγκεκριμένου ποσού. Χρησιμοποιήστε τη μορφή: 25.254,28', 'error');
                return;
            }
            
            if (contractAmount && !amountPattern.test(contractAmount)) {
                this.showToast('Λάθος μορφή ποσού σύμβασης. Χρησιμοποιήστε τη μορφή: 25.254,28', 'error');
                return;
            }
            
            if (additionalContracts && !amountPattern.test(additionalContracts)) {
                this.showToast('Λάθος μορφή επιπλέον ποσού. Χρησιμοποιήστε τη μορφή: 25.254,28', 'error');
                return;
            }
            
            // Μετατροπή PDF αρχείων σε base64
            const pdfFilesBase64 = await this.convertFilesToBase64(this.selectedFiles);
            
            if (this.currentEditingSubproject) {
                // Επεξεργασία υπάρχοντος υποέργου
                this.updateExistingSubproject(pdfFilesBase64);
            } else {
                // Δημιουργία νέου υποέργου
                this.createNewSubproject(pdfFilesBase64);
            }
            
        } catch (error) {
            console.error('Σφάλμα αποθήκευσης υποέργου:', error);
            this.showToast('Σφάλμα αποθήκευσης υποέργου', 'error');
        }
    }

    createNewSubproject(pdfFilesBase64) {
        const subprojectData = {
            projectId: 'project_' + Date.now(),
            subprojectId: 'subproject_' + Date.now(),
            projectTitle: document.getElementById('projectTitle').value,
            subprojectTitle: document.getElementById('subprojectTitle').value,
            kaCode: document.getElementById('kaCode').value,
            approvedAmount: document.getElementById('approvedAmount').value,
            fundingSource: document.getElementById('fundingSource').value,
            fundingSpecialization: document.getElementById('fundingSpecialization').value,
            status: document.getElementById('status').value,
            type: document.getElementById('type').value,
            contractAmount: document.getElementById('contractAmount').value || null,
            contractDate: document.getElementById('contractDate').value || null,
            additionalContracts: document.getElementById('additionalContracts').value || null,
            supervisor: document.getElementById('supervisor').value,
            comments: document.getElementById('comments').value,
            pdfFiles: this.selectedFiles.map(file => file.name),
            pdfFileData: this.selectedFiles.map(file => ({
                name: file.name,
                size: file.size,
                type: file.type,
                lastModified: file.lastModified
            })),
            pdfFilesBase64: pdfFilesBase64,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        // Αποθήκευση στο σύστημα αρχείων (αν είναι Electron)
        this.saveToFileSystem(subprojectData).then(() => {
            this.subprojects.push(subprojectData);
            this.saveToLocalStorage();
            this.displayProjects();
            this.hideSubprojectModal();
            this.showToast('Το υποέργο αποθηκεύθηκε επιτυχώς!', 'success');
        }).catch((error) => {
            this.showToast('Σφάλμα αποθήκευσης στο σύστημα: ' + error.message, 'error');
        });
    }

    updateExistingSubproject(pdfFilesBase64) {
        // Εύρεση του υπάρχοντος υποέργου
        const existingIndex = this.subprojects.findIndex(sp => 
            sp.subprojectId === this.currentEditingSubproject.subprojectId
        );
        
        if (existingIndex !== -1) {
            // Ενημέρωση υπάρχοντος υποέργου
            const updatedSubproject = {
                ...this.currentEditingSubproject,
                subprojectTitle: document.getElementById('subprojectTitle').value,
                kaCode: document.getElementById('kaCode').value,
                approvedAmount: document.getElementById('approvedAmount').value,
                fundingSource: document.getElementById('fundingSource').value,
                fundingSpecialization: document.getElementById('fundingSpecialization').value,
                status: document.getElementById('status').value,
                type: document.getElementById('type').value,
                contractAmount: document.getElementById('contractAmount').value || null,
                contractDate: document.getElementById('contractDate').value || null,
                additionalContracts: document.getElementById('additionalContracts').value || null,
                supervisor: document.getElementById('supervisor').value,
                comments: document.getElementById('comments').value,
                pdfFiles: this.selectedFiles.map(file => file.name),
                pdfFileData: this.selectedFiles.map(file => ({
                    name: file.name,
                    size: file.size,
                    type: file.type,
                    lastModified: file.lastModified
                })),
                pdfFilesBase64: pdfFilesBase64,
                updatedAt: new Date().toISOString()
            };
            
            // Ενημέρωση στο σύστημα αρχείων (αν είναι Electron)
            this.saveToFileSystem(updatedSubproject).then(() => {
                this.subprojects[existingIndex] = updatedSubproject;
                this.saveToLocalStorage();
                this.displayProjects();
                this.hideSubprojectModal();
                this.showToast('Το υποέργο ενημερώθηκε επιτυχώς!', 'success');
            }).catch((error) => {
                this.showToast('Σφάλμα ενημέρωσης στο σύστημα: ' + error.message, 'error');
            });
        }
    }

    async convertFilesToBase64(files) {
        const base64Files = [];
        
        for (const file of files) {
            try {
                const base64 = await this.fileToBase64(file);
                base64Files.push({
                    name: file.name,
                    data: base64,
                    type: file.type,
                    size: file.size
                });
            } catch (error) {
                console.error('Σφάλμα μετατροπής αρχείου σε base64:', error);
            }
        }
        
        return base64Files;
    }

    fileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }

    saveToLocalStorage() {
        localStorage.setItem('technicalService_projects', JSON.stringify(this.projects));
        localStorage.setItem('technicalService_subprojects', JSON.stringify(this.subprojects));
    }

    handleSearch(searchTerm) {
        if (!searchTerm) {
            this.displayProjects();
            return;
        }
        
        const filteredSubprojects = this.subprojects.filter(subproject => 
            subproject.projectTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
            subproject.subprojectTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
            subproject.kaCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
            subproject.comments.toLowerCase().includes(searchTerm.toLowerCase())
        );
        
        this.displayFilteredResults(filteredSubprojects);
    }

    handleFilter(filterValue) {
        if (!filterValue) {
            this.displayProjects();
            return;
        }
        
        const filteredSubprojects = this.subprojects.filter(subproject => subproject.status === filterValue);
        this.displayFilteredResults(filteredSubprojects);
    }

    displayFilteredResults(subprojects) {
        const container = document.getElementById('projectsContainer');
        
        if (subprojects.length === 0) {
            container.innerHTML = `
                <div class="text-center py-12">
                    <i class="fas fa-search text-6xl text-gray-300 mb-4"></i>
                    <h3 class="text-xl font-semibold text-gray-600 mb-2">Δεν βρέθηκαν αποτελέσματα</h3>
                    <p class="text-gray-500">Δοκιμάστε διαφορετικούς όρους αναζήτησης</p>
                </div>
            `;
            return;
        }
        
        // Ομαδοποίηση για εμφάνιση
        const projectsMap = new Map();
        subprojects.forEach(subproject => {
            if (!projectsMap.has(subproject.projectTitle)) {
                projectsMap.set(subproject.projectTitle, []);
            }
            projectsMap.get(subproject.projectTitle).push(subproject);
        });
        
        let html = '';
        projectsMap.forEach((subprojects, projectTitle) => {
            html += this.renderProjectCard(projectTitle, subprojects);
        });
        
        container.innerHTML = html;
    }

    loadFilesList(projectId, subprojectId) {
        const subproject = this.subprojects.find(sp => 
            sp.projectTitle === projectId && sp.subprojectId === subprojectId
        );
        
        if (subproject && subproject.pdfFilesBase64) {
            const filesList = document.getElementById('filesList');
            const filesCount = document.getElementById('filesCount');
            
            filesCount.textContent = subproject.pdfFilesBase64.length;
            
            if (subproject.pdfFilesBase64.length === 0) {
                filesList.innerHTML = `
                    <div class="text-center py-8 text-gray-500">
                        <i class="fas fa-folder-open text-4xl mb-4"></i>
                        <p>Δεν υπάρχουν αρχεία σε αυτό το υποέργο</p>
                    </div>
                `;
            } else {
                filesList.innerHTML = subproject.pdfFilesBase64.map((file, index) => `
                    <div class="flex items-center justify-between bg-gray-50 rounded-lg p-3 border border-gray-200">
                        <div class="flex items-center space-x-3">
                            <i class="fas fa-file-pdf text-red-500"></i>
                            <span class="text-gray-700">${file.name}</span>
                            ${subproject.pdfFileData && subproject.pdfFileData[index] ? 
                                `<span class="text-xs text-gray-500">(${(subproject.pdfFileData[index].size / 1024 / 1024).toFixed(2)} MB)</span>` : 
                                ''
                            }
                        </div>
                        <div class="flex space-x-2">
                            <button onclick="app.viewPdfFile('${file.name}', '${projectId}', '${subprojectId}')" 
                                    class="text-blue-600 hover:text-blue-800 px-2 py-1 rounded">
                                <i class="fas fa-eye mr-1"></i> Προβολή
                            </button>
                            <button onclick="app.downloadFile('${file.name}', '${projectId}', '${subprojectId}')" 
                                    class="text-green-600 hover:text-green-800 px-2 py-1 rounded">
                                <i class="fas fa-download mr-1"></i> Λήψη
                            </button>
                        </div>
                    </div>
                `).join('');
            }
        }
    }

    viewPdfFile(fileName, projectId, subprojectId) {
        const subproject = this.subprojects.find(sp => 
            sp.projectTitle === projectId && sp.subprojectId === subprojectId
        );
        
        if (subproject && subproject.pdfFilesBase64) {
            const fileData = subproject.pdfFilesBase64.find(f => f.name === fileName);
            if (fileData) {
                // Άνοιγμα PDF με base64 data
                window.open(fileData.data, '_blank');
                this.showToast(`Προβολή αρχείου: ${fileName}`, 'success');
            } else {
                this.showToast('Το αρχείο δεν βρέθηκε', 'error');
            }
        } else {
            this.showToast('Δεν υπάρχουν PDF αρχεία', 'error');
        }
    }

    downloadFile(fileName, projectId, subprojectId) {
        const subproject = this.subprojects.find(sp => 
            sp.projectTitle === projectId && sp.subprojectId === subprojectId
        );
        
        if (subproject && subproject.pdfFilesBase64) {
            const fileData = subproject.pdfFilesBase64.find(f => f.name === fileName);
            if (fileData) {
                // Λήψη PDF με base64 data
                const a = document.createElement('a');
                a.href = fileData.data;
                a.download = fileName;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                this.showToast(`Λήψη αρχείου: ${fileName}`, 'success');
            } else {
                this.showToast('Το αρχείο δεν βρέθηκε', 'error');
            }
        } else {
            this.showToast('Δεν υπάρχουν PDF αρχεία', 'error');
        }
    }

    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `bg-${this.getToastColor(type)} text-white px-6 py-3 rounded-lg shadow-lg transform transition-all duration-300 translate-x-full`;
        toast.innerHTML = `
            <div class="flex items-center">
                <i class="fas fa-${this.getToastIcon(type)} mr-3"></i>
                <span>${message}</span>
            </div>
        `;
        
        document.getElementById('toastContainer').appendChild(toast);
        
        setTimeout(() => {
            toast.classList.remove('translate-x-full');
        }, 100);
        
        setTimeout(() => {
            toast.classList.add('translate-x-full');
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 5000);
    }

    getToastColor(type) {
        const colors = {
            'success': 'green-500',
            'error': 'red-500',
            'warning': 'yellow-500',
            'info': 'blue-500'
        };
        return colors[type] || 'blue-500';
    }

    getToastIcon(type) {
        const icons = {
            'success': 'check-circle',
            'error': 'exclamation-circle',
            'warning': 'exclamation-triangle',
            'info': 'info-circle'
        };
        return icons[type] || 'info-circle';
    }

    editSubproject(projectTitle, subprojectId) {
        const subproject = this.subprojects.find(sp => 
            sp.projectTitle === projectTitle && sp.subprojectId === subprojectId
        );
        
        if (subproject) {
            this.currentEditingSubproject = subproject;
            this.showSubprojectModal();
            this.populateFormWithSubprojectData(subproject);
        } else {
            this.showToast('Το υποέργο δεν βρέθηκε', 'error');
        }
    }

    populateFormWithSubprojectData(subproject) {
        // Συμπλήρωση φόρμας με υπάρχοντα δεδομένα
        document.getElementById('projectTitle').value = subproject.projectTitle;
        document.getElementById('subprojectTitle').value = subproject.subprojectTitle;
        document.getElementById('kaCode').value = subproject.kaCode;
        document.getElementById('approvedAmount').value = subproject.approvedAmount;
        document.getElementById('fundingSource').value = subproject.fundingSource;
        document.getElementById('status').value = subproject.status;
        document.getElementById('type').value = subproject.type;
        document.getElementById('supervisor').value = subproject.supervisor || '';
        document.getElementById('comments').value = subproject.comments || '';
        
        // Συμπλήρωση πεδίων σύμβασης αν υπάρχουν
        if (subproject.contractAmount) {
            document.getElementById('contractAmount').value = subproject.contractAmount;
        }
        if (subproject.contractDate) {
            document.getElementById('contractDate').value = subproject.contractDate;
        }
        if (subproject.additionalContracts) {
            document.getElementById('additionalContracts').value = subproject.additionalContracts;
        }
        
        // Εμφάνιση πεδίων σύμβασης αν χρειάζεται
        if (subproject.status === 'executing' || subproject.status === 'completed') {
            this.showContractFields();
        }
        
        // Φόρτωση εξειδικεύσεων χρηματοδότησης
        this.populateFundingSpecializations(subproject.fundingSource);
        if (subproject.fundingSpecialization) {
            setTimeout(() => {
                document.getElementById('fundingSpecialization').value = subproject.fundingSpecialization;
            }, 100);
        }
        
        // Φόρτωση υπάρχοντων PDF αρχείων
        this.loadExistingPdfFiles(subproject);
        
        // Κλείδωμα πεδίου τίτλου έργου
        document.getElementById('projectTitle').disabled = true;
        document.getElementById('projectTitle').classList.add('bg-gray-100', 'cursor-not-allowed');
        
        // Αλλαγή κειμένου κουμπιού αποθήκευσης
        const submitBtn = document.querySelector('#subprojectForm button[type="submit"]');
        submitBtn.innerHTML = '<i class="fas fa-save mr-2"></i> ΕΝΗΜΕΡΩΣΗ ΥΠΟΕΡΓΟΥ';
    }

    loadExistingPdfFiles(subproject) {
        const filesList = document.getElementById('selectedFiles');
        filesList.innerHTML = ''; // Εκκαθάριση προηγούμενων αρχείων

        if (subproject.pdfFilesBase64 && subproject.pdfFilesBase64.length > 0) {
            // Φόρτωση υπάρχοντων PDF αρχείων
            this.selectedFiles = subproject.pdfFilesBase64.map(file => {
                // Δημιουργία File object από τα base64 δεδομένα
                const blob = this.base64ToBlob(file.data, file.type);
                return new File([blob], file.name, { type: file.type });
            });
            
            this.updateSelectedFilesDisplay();
        } else {
            this.selectedFiles = [];
            this.updateSelectedFilesDisplay();
        }
    }

    base64ToBlob(base64, mimeType) {
        const byteCharacters = atob(base64.split(',')[1]);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        return new Blob([byteArray], { type: mimeType });
    }

    async deleteSubproject(projectTitle, subprojectId) {
        if (confirm('Είστε βέβαιοι ότι θέλετε να διαγράψετε αυτό το υποέργο; Αυτό δεν είναι αντιστρέψιμο.')) {
            try {
                // Εύρεση του υποέργου προς διαγραφή
                const subprojectToDelete = this.subprojects.find(sp => 
                    sp.projectTitle === projectTitle && sp.subprojectId === subprojectId
                );
                
                if (subprojectToDelete) {
                    // Διαγραφή φακέλου υποέργου από το σύστημα (αν είναι Electron)
                    if (window.electronAPI && subprojectToDelete.subprojectPath) {
                        try {
                            await window.electronAPI.deleteDirectory(subprojectToDelete.subprojectPath);
                        } catch (error) {
                            console.warn('Σφάλμα διαγραφής φακέλου υποέργου:', error);
                        }
                    }
                    
                    // Διαγραφή του υποέργου από τη λίστα
                    this.subprojects = this.subprojects.filter(subproject => 
                        !(subproject.projectTitle === projectTitle && subproject.subprojectId === subprojectId)
                    );
                    
                    // Έλεγχος αν υπάρχουν άλλα υποέργα στο ίδιο έργο
                    const remainingSubprojectsInProject = this.subprojects.filter(sp => 
                        sp.projectTitle === projectTitle
                    );
                    
                    // Αν δεν υπάρχουν άλλα υποέργα, διαγραφή του φακέλου έργου
                    if (remainingSubprojectsInProject.length === 0 && subprojectToDelete.projectPath) {
                        try {
                            if (window.electronAPI) {
                                await window.electronAPI.deleteDirectory(subprojectToDelete.projectPath);
                            }
                            this.showToast(`Το υποέργο διαγράφηκε και ο φάκελος έργου "${projectTitle}" διαγράφηκε επίσης!`, 'success');
                        } catch (error) {
                            console.warn('Σφάλμα διαγραφής φακέλου έργου:', error);
                            this.showToast('Το υποέργο διαγράφηκε αλλά υπήρξε πρόβλημα με τη διαγραφή του φακέλου έργου.', 'warning');
                        }
                    } else {
                        this.showToast('Το υποέργο διαγράφηκε επιτυχώς!', 'success');
                    }
                    
                    this.saveToLocalStorage();
                    this.displayProjects();
                } else {
                    this.showToast('Το υποέργο δεν βρέθηκε.', 'error');
                }
            } catch (error) {
                console.error('Σφάλμα διαγραφής υποέργου:', error);
                this.showToast('Σφάλμα διαγραφής υποέργου: ' + error.message, 'error');
            }
        }
    }

    async openProjectFolder(projectTitle, subprojectId) {
        const subproject = this.subprojects.find(sp => 
            sp.projectTitle === projectTitle && sp.subprojectId === subprojectId
        );

        if (subproject && subproject.subprojectPath) {
            try {
                if (window.electronAPI) {
                    await window.electronAPI.openDirectory(subproject.subprojectPath);
                    this.showToast(`Ανοίχτηκε ο φάκελος: ${subproject.subprojectPath}`, 'info');
                } else {
                    window.open(subproject.subprojectPath, '_blank');
                    this.showToast(`Ανοίχτηκε ο φάκελος: ${subproject.subprojectPath}`, 'info');
                }
            } catch (error) {
                console.error('Σφάλμα ανοίγματος φακέλου:', error);
                this.showToast('Σφάλμα ανοίγματος φακέλου: ' + error.message, 'error');
            }
        } else {
            this.showToast('Δεν υπάρχει φάκελος για αυτό το υποέργο.', 'warning');
        }
    }
}

// Αρχικοποίηση εφαρμογής όταν φορτώσει η σελίδα
document.addEventListener('DOMContentLoaded', () => {
    window.app = new TechnicalServiceApp();
});

// Global functions για χρήση από HTML
window.selectRole = (role) => {
    window.app.selectRole(role);
};
