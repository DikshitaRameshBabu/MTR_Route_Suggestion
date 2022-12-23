import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { AuthenticateService } from 'src/app/services/authenticate.service';
import { UserStoreService } from 'src/app/services/user-store.service';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit{
  
  public fullName :string = "";
  public role! :string ;
  public users:any=[];
  public stations:any=[];
  public searchHistory:any=[];
  public startpoint:string = "";
  public endpoint:string = "";
  routeSuggestionForm!: FormGroup;
  listRouteSuggestion: any=[];
  ChangeStartpoint(e:any){
    this.startpoint=e.target.value;
  }
  ChangeEndpoint(e:any){
    this.endpoint=e.target.value;
  }
  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private auth: AuthenticateService,
    private userStore: UserStoreService){}

  ngOnInit(){
    this.api.getUsers()
    .subscribe(res=>{
      this.users = res;
    })

    this.api.getStations()
    .subscribe(res=>{
      this.stations=res;
    })

    this.api.getSearchHistory()
    .subscribe(res=>{
      this.searchHistory=res;
    })

    this.userStore.getFullNameFromStore()
      .subscribe(val=>{
      let fullNameFromToken = this.auth.getFullNameFromToken();
      this.fullName = val || fullNameFromToken
    })

    this.userStore.getRoleFromStore()
    .subscribe(val=>{
      const roleFromtoken=this.auth.getRoleFromToken();
      this.role=val ||roleFromtoken;
    })

    this.routeSuggestionForm = this.fb.group({
      startpoint:['',Validators.required],
      endpoint:['',Validators.required]
    })
    
  }
  logOut(){
    this.auth.signOut();
  }
  onSearch(){
    if(this.routeSuggestionForm.valid){
      this.api.getRouteSuggestion(this.startpoint,this.endpoint)
      .subscribe(
      data=>{
        this.listRouteSuggestion=data;   
      }
      )
      this.api.searchHistory(this.routeSuggestionForm.value)
      .subscribe({
        next:(res)=>{
        },
        error:(err)=>{
          alert(err?.error.message)
        }
      })
   
    }else{
      this.validateAllFormFields(this.routeSuggestionForm);
    }
  }
  private validateAllFormFields(formGroup:FormGroup){
    Object.keys(formGroup.controls).forEach(field=>{
      const control = formGroup.get(field);
      if(control instanceof FormControl){
        control?.markAsDirty({onlySelf:true});
      }else if(control instanceof FormGroup){
        this.validateAllFormFields(control);
      }
    })
  }
}
